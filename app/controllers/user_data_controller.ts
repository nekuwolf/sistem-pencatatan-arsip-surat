import User from '#models/user'
import UploadedFile from '#models/uploaded_file'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import drive from '@adonisjs/drive/services/main'
import AvatarGeneratorService from '#services/avatar_generator_service'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { mapUsersDatasToDesktopTableMobileListEdgeView } from '../helpers/user_data_edge_mapper.js'

@inject()
export default class UserDataController {
  constructor(protected avatarService: AvatarGeneratorService) {}

  /**
   * Display a list of resource
   */
  async index({ view, request, auth }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    let paginatorResult

    if (user.isAdmin) {
      paginatorResult = await User.allUserInOrganizationIdPreloadEverythingPaginate(
        user.organizationId,
        page
      )
    } else if (user.isEmployee) {
      paginatorResult = await User.allUserInDepartmentIdInOrganizationIdPreloadEverythingPaginate(
        user.departmentId,
        user.organizationId,
        page
      )
    }

    if (paginatorResult) {
      paginatorResult.baseUrl(request.url())
    }

    const userTableDatas = paginatorResult
      ? mapUsersDatasToDesktopTableMobileListEdgeView(paginatorResult.all())
      : null

    return view.render('pages/dashboard/user/index', {
      userTableDatas: userTableDatas,
      paginator: paginatorResult,
    })
  }

  /**
   * Show a SPECIFIC user's profile picture
   * GET /user/:userId/picture
   */
  async showPicture({ params, response, request }: HttpContext) {
    const user = await User.findOrFail(params.userId)
    await user.load('profilePictureFile')
    const avatar = user.profilePictureFile

    // 1. Fallback: Generate SVG if no avatar exists
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

    // 2. Custom Avatar Logic
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
   * POST /user/:userId/picture (or PUT)
   */
  async updatePicture({ params, request, response }: HttpContext) {
    const targetUser = await User.findOrFail(params.userId)

    const avatarFile = request.file('avatar', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    })

    if (!avatarFile || !avatarFile.isValid) {
      return response.badRequest(avatarFile?.errors || { message: 'No file uploaded' })
    }

    const uploadedAt = DateTime.utc()
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
      uploadedByUserId: targetUser.id,
      sha256Checksum: checksum,
    })

    targetUser.profilePictureFileId = uploadedFile.id
    await targetUser.save()

    return response.ok({
      message: `Profile picture for ${targetUser.fullName || targetUser.email} updated`,
      data: { id: uploadedFile.id, path: fullPathKey },
    })
  }

  // ... other existing methods (create, store, show, edit, update, destroy)
}