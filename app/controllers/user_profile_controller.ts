import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import fs from 'node:fs'

import User from '#models/user'
import UploadedFile from '#models/uploaded_file'
import AvatarGeneratorService from '#services/avatar_generator_service'
import { updateUserProfileValidator } from '#validators/user_profile_validator'
import Gender from '#models/gender'

@inject()
export default class UserProfileController {
  constructor(protected avatarService: AvatarGeneratorService) {}

  /**
   * Display own profile (Web View)
   */
  async index({ view, request, auth }: HttpContext) {
    const qs = request.qs()
    const isEditing = qs.edit === 'true'
    const user = auth.user!

    await user.load((loader) => {
      loader.load('gender').load('organization').load('department').load('jobRole').load('role')
    })

    let genderOptions;
    if (isEditing) {
      const genders = await Gender.all()
      genderOptions = genders.map((g) => ({
        value: g.id,
        label: g.name,
        isSelected: user.genderId === g.id,
      }))
    }

    let template = 'pages/user_profile/index'
    if (isEditing) {
      template = 'pages/user_profile/edit'
    }

    return view.render(template, {
      genderOptions,
    })
  }

  /**
   * Stream the profile picture or generated avatar
   * GET /profile/avatar
   */
  async showAvatar({ response, auth, request }: HttpContext) {
    const user = auth.user!
    await user.load('profilePictureFile')
    const avatar = user.profilePictureFile

    // 1. Fallback to SVG Generator if no file exists
    if (!avatar) {
      const nameForAvatar = user.fullName || user.email
      const svg = this.avatarService.generate(nameForAvatar)
      const generatedEtag = `"${Buffer.from(nameForAvatar).toString('base64')}"`

      if (request.header('if-none-match') === generatedEtag) {
        return response.notModified()
      }

      return response
        .header('Content-Type', 'image/svg+xml')
        .header('Cache-Control', 'public, max-age=604800')
        .header('ETag', generatedEtag)
        .send(svg)
    }

    // 2. Serve file from Disk
    const etag = `"${avatar.sha256Checksum}"`
    if (request.header('if-none-match') === etag) {
      return response.notModified()
    }

    const disk = drive.use('localStoragePrivate')

    if (!(await disk.exists(avatar.fileLocationPath))) {
      return response
        .header('Content-Type', 'image/svg+xml')
        .send(this.avatarService.generate(user.fullName || user.email))
    }

    const stream = await disk.getStream(avatar.fileLocationPath)
    response.header('ETag', etag)
    response.header('Cache-Control', 'private, must-revalidate')
    response.type(avatar.filename)
    return response.stream(stream)
  }

  /**
   * Combined Update: Handles both Text and File Upload
   */
  public async update({ auth, request, response, session }: HttpContext) {
    const user = auth.user!
    const disk = drive.use('localStoragePrivate')

    // 1. Validate the request
    const payload = await request.validateUsing(updateUserProfileValidator)

    // 2. Handle Avatar File (if provided in payload)
    if (payload.avatar) {
      const avatarFile = payload.avatar

      // Cleanup: Delete old avatar if it exists
      await user.load('profilePictureFile')
      const oldAvatar = user.profilePictureFile
      if (oldAvatar) {
        user.profilePictureFileId = null
        await user.save()
        
        if (await disk.exists(oldAvatar.fileLocationPath)) {
          await disk.delete(oldAvatar.fileLocationPath)
        }
        await oldAvatar.delete()
      }

      // Process new file
      const uploadedAt = DateTime.utc()
      const folderPath = `user/${user.id}/profile_pictures`
      const sanitizedName = (avatarFile.clientName || 'avatar').replace(/[^a-zA-Z0-9._-]/g, '_')
      const fullPathKey = `${folderPath}/${uploadedAt.toMillis()}_${sanitizedName}`

      // Calculate checksum for integrity
      const fileBuffer = await fs.promises.readFile(avatarFile.tmpPath!)
      const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex')

      // Move to private storage
      await avatarFile.moveToDisk(fullPathKey, 'localStoragePrivate')

      // Create record in UploadedFile table
      const uploadedFile = await UploadedFile.create({
        filename: sanitizedName,
        fileSizeByte: avatarFile.size,
        uploadDate: uploadedAt,
        fileLocationPath: fullPathKey,
        uploadedByUserId: user.id,
        sha256Checksum: checksum,
      })

      user.profilePictureFileId = uploadedFile.id
    }

    // 3. Update Model with payload data
    user.merge({
      fullName: payload.full_name || '',
      personalPhoneNumber: payload.personal_phone_number || '',
      birthDate: payload.birth_date ? DateTime.fromJSDate(payload.birth_date) : undefined,
      birthPlace: payload.birth_place || '',
      fullHomeAddress: payload.full_home_address || '',
      genderId: payload.gender_id,
      password: payload.password,
    })

    // 4. Persist changes
    await user.save()

    session.flash('profileFormAlertMessage', 'Profile updated successfully!')
    return response.redirect().toRoute('account.profile.index')
  }
}