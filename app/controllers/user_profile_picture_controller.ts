import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import drive from '@adonisjs/drive/services/main'
import UploadedFile from '#models/uploaded_file'
import crypto from 'node:crypto'
import fs from 'node:fs'

// 1. Add these imports
import { inject } from '@adonisjs/core'
import AvatarGeneratorService from '#services/avatar_generator_service'

// 2. Add the @inject() decorator
@inject()
export default class UserProfilePictureController {
  
  // 3. Inject the service in the constructor
  constructor(protected avatarService: AvatarGeneratorService) {}

  /**
   * Show CURRENT user's profile picture
   * GET /profile/picture
   */
  async index({ response, auth, request }: HttpContext) {
    const user = auth.user!

    // Load custom avatar
    await user.load('profilePictureFile')
    const avatar = user.profilePictureFile

    // ---------------------------------------------------------
    // FALLBACK: If no custom avatar, generate SVG
    // ---------------------------------------------------------
    if (!avatar) {
      // Use fullName, fallback to email if name is empty
      const nameForAvatar = user.fullName || user.email
      const svg = this.avatarService.generate(nameForAvatar)

      // Optional: Create a simple ETag for the generated avatar based on the name
      // If the user changes their name, the avatar (initials/color) changes, so the ETag should change.
      const generatedEtag = `"${Buffer.from(nameForAvatar).toString('base64')}"`

      if (request.header('if-none-match') === generatedEtag) {
        return response.notModified()
      }

      return response
        .header('Content-Type', 'image/svg+xml')
        .header('Cache-Control', 'public, max-age=604800') // Cache for 1 week
        .header('ETag', generatedEtag)
        .send(svg)
    }

    // ---------------------------------------------------------
    // EXISTING LOGIC: Custom Avatar exists
    // ---------------------------------------------------------

    const etag = `"${avatar.sha256Checksum}"`
    if (request.header('if-none-match') === etag) {
      return response.notModified()
    }

    const disk = drive.use('localStoragePrivate')
    
    // Check if file exists on disk
    if (!await disk.exists(avatar.fileLocationPath)) {
      // Edge case: DB says we have avatar, but file is gone.
      // Fallback to generator instead of erroring out? 
      // For now, let's just return the generator to be safe.
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
   * Update/Upload profile picture
   * POST /profile/picture
   */
  async update({ request, auth, response }: HttpContext) {
    // ... (Your existing update logic remains exactly the same) ...
    // Just ensure you include the update method code here
    
    const authUser = auth.user!
    const avatarFile = request.file('avatar', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    })

    if (!avatarFile || !avatarFile.isValid) {
      return response.badRequest(avatarFile?.errors || { message: 'No file uploaded' })
    }

    const uploadedAt = DateTime.utc()
    const folderPath = `user/${authUser.id}/profile_pictures`
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
      uploadedByUserId: authUser.id,
      sha256Checksum: checksum,
    })

    authUser.profilePictureFileId = uploadedFile.id
    await authUser.save()

    return response.ok({
      message: 'Profile picture updated successfully',
      data: { id: uploadedFile.id, path: fullPathKey }
    })
  }
}