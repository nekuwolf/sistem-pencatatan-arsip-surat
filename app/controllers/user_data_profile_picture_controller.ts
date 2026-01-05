import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import drive from '@adonisjs/drive/services/main'
import UploadedFile from '#models/uploaded_file'
import User from '#models/user' // Ensure you import your User model
import crypto from 'node:crypto'
import fs from 'node:fs'

import { inject } from '@adonisjs/core'
import AvatarGeneratorService from '#services/avatar_generator_service'

@inject()
export default class UserDataProfilePictureController {
  constructor(protected avatarService: AvatarGeneratorService) {}

  /**
   * Show a SPECIFIC user's profile picture
   * GET /user/:userId/picture
   */
  async show({ params, response, request }: HttpContext) {
    // 1. Find user by ID from route params
    const user = await User.findOrFail(params.userId)

    // 2. Load custom avatar
    await user.load('profilePictureFile')
    const avatar = user.profilePictureFile

    // 3. Fallback: Generate SVG if no avatar exists
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

    // 4. Custom Avatar Logic
    const etag = `"${avatar.sha256Checksum}"`
    if (request.header('if-none-match') === etag) {
      return response.notModified()
    }

    const disk = drive.use('localStoragePrivate')

    if (!(await disk.exists(avatar.fileLocationPath))) {
      const nameForAvatar = user.fullName || user.email
      return response
        .header('Content-Type', 'image/svg+xml')
        .send(this.avatarService.generate(nameForAvatar))
    }

    const stream = await disk.getStream(avatar.fileLocationPath)
    response.header('ETag', etag)
    response.header('Cache-Control', 'private, must-revalidate')
    response.type(avatar.filename)

    return response.stream(stream)
  }

  /**
   * Update a SPECIFIC user's profile picture
   * POST /user/:userId/picture
   */
  async update({ params, request, response }: HttpContext) {
    const targetUser = await User.findOrFail(params.userId)
    
    const avatarFile = request.file('avatar', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    })

    if (!avatarFile || !avatarFile.isValid) {
      return response.badRequest(avatarFile?.errors || { message: 'No file uploaded' })
    }

    const uploadedAt = DateTime.utc()
    // Note: We use the targetUser.id here, not the auth user
    const folderPath = `user/${targetUser.id}/profile_pictures`
    const rawName = avatarFile.clientName || `avatar.${avatarFile.extname}`
    const sanitizedName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const fullPathKey = `${folderPath}/${uploadedAt.toMillis()}_${sanitizedName}`

    const fileBuffer = await fs.promises.readFile(avatarFile.tmpPath!)
    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex')

    await avatarFile.moveToDisk(fullPathKey, 'localStoragePrivate', {
      contentType: avatarFile.headers['content-type'],
    })

    const uploadedFile = await UploadedFile.create({
      filename: sanitizedName,
      fileSizeByte: avatarFile.size,
      uploadDate: uploadedAt,
      fileLocationPath: fullPathKey,
      uploadedByUserId: targetUser.id, // Or auth.user.id if you want to track who performed the admin action
      sha256Checksum: checksum,
    })

    targetUser.profilePictureFileId = uploadedFile.id
    await targetUser.save()

    return response.ok({
      message: `Profile picture for ${targetUser.fullName || targetUser.email} updated`,
      data: { id: uploadedFile.id, path: fullPathKey },
    })
  }
}