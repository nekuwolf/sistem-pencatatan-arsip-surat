import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import fs from 'node:fs'
import crypto from 'node:crypto'
import Mail from '#models/mail'
import MailType from '#models/mail_type'
import MailPriority from '#models/mail_priority'
import MailCode from '#models/mail_code'
import UploadedFile from '#models/uploaded_file'
import { createMailValidator, updateMailValidator } from '#validators/mail'
import drive from '@adonisjs/drive/services/main' // Import drive service
import db from '@adonisjs/lucid/services/db'
import { mapMailsDatasToDesktopTableMobileListEdgeView } from '../helpers/mail_data_edge_mapper.js'

export default class MailDashboardController {
  /**
   * 1. Display list
   */
  async index({ view, request, auth }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)

    let paginatorResult

    if (user.isAdmin || user.isEmployee) {
      paginatorResult =
        await Mail.allMailInOrganizationIdPreloadEverythingPaginate(
          user.organizationId,
          page
        )
    } else {
      paginatorResult =
        await Mail.allMailByUserIdPreloadEverythingPaginate(
          user.id,
          page
        )
    }

    paginatorResult.baseUrl(request.url())

    const mailTableDatas =
      mapMailsDatasToDesktopTableMobileListEdgeView(
        paginatorResult.all()
      )

    return view.render('pages/mail/index', {
      mailTableDatas,
      paginator: paginatorResult,
    })
  }


  /**
   * 2. Show Create Form
   */
  async create({ view }: HttpContext) {
    const { mailTypeOptions, mailPriorityOptions, mailCodeOptions } = await this.getRelationOptions()
    return view.render('pages/mail/form', {
      isCreatingNew: true,
      mailTypeOptions,
      mailPriorityOptions,
      mailCodeOptions,
    })
  }

  /**
   * 3. Handle Storage (Mail + Initial File)
   */
  async store({ request, response, auth, session }: HttpContext) {
    const payload = await request.validateUsing(createMailValidator)
    const authUser = auth.user!

    // Create the Mail record first
    const mail = await Mail.create({
      mailSource: payload.mail_source,
      fullMailCode: payload.full_mail_code,
      agendaNumber: payload.agenda_number,
      mailDate: payload.mail_date ? DateTime.fromJSDate(payload.mail_date) : null,
      registeredAt: payload.registered_at ? DateTime.fromJSDate(payload.registered_at) : null,
      mailPaperCount: payload.mail_paper_count,
      mailAttachmentPaperCount: payload.mail_attachment_paper_count,
      mailContentSummary: payload.mail_content_summary,
      mailTypeId: payload.mail_type_id,
      mailPriorityId: payload.mail_priority_id,
      mailCodeId: payload.mail_code_id,
      createdByUserId: authUser.id,
      rackName: payload.rack_name,
      shelfName: payload.shelf_name,
      boxName: payload.box_name,
      envelopeName: payload.envelope_name
    })

    // Handle File Upload if present
    const file = request.file('mail_file')
    if (file && file.isValid) {
      const uploadedFile = await this.processFileUpload(file, mail.id, authUser.id)
      mail.uploadedMailFileId = uploadedFile.id
      await mail.save()
    }

    session.flash('notification', { type: 'success', message: 'Mail record created successfully' })
    return response.redirect().toRoute('mails.show', { mailId: mail.id })
  }

  /**
   * 4. Show Detail
   */
  async show({ params, view, request }: HttpContext) {
    // 1. Fetch the mail with all necessary relationships
    const mail = await Mail.query()
      .where('id', params.mailId)
      .preload('mailType')
      .preload('mailPriority')
      .preload('mailCode')
      .preload('uploadedMailFile')
      .firstOrFail()

    // 2. Check if the 'edit' query param exists (?edit=true)
    const isEditing = request.input('edit') === 'true'

    // 3. Prepare options only if we are editing
    let options = {}
    if (isEditing) {
      options = await this.getRelationOptions()
    }

    // 4. Render the form view
    return view.render('pages/mail/form', {
      mail,
      isViewingDetail: !isEditing,
      isEditing: isEditing,
      ...options
    })
  }

  /**
   * 5. Stream/Show File
   */
  async showFile({ params, response }: HttpContext) {
    const mail = await Mail.query()
      .where('id', params.mailId)
      .preload('uploadedMailFile')
      .firstOrFail()

    if (!mail.uploadedMailFile) {
      return response.notFound('No file attached to this mail')
    }

    const key = mail.uploadedMailFile.fileLocationPath
    const disk = drive.use('localStoragePrivate')

    try {
      // 1. Check if file exists and get metadata (replaces getStats)
      const metaData = await disk.getMetaData(key)

      // 2. Get the stream
      const stream = await disk.getStream(key)

      // 3. Set headers (optional but recommended for PDFs/Images)
      response.header('Content-Type', metaData.contentType || 'application/octet-stream')
      response.header('Content-Length', metaData.contentLength)
      
      // Use 'inline' to view in browser, or 'attachment' to force download
      response.header('Content-Disposition', `inline; filename="${mail.uploadedMailFile.filename}"`)

      return response.stream(stream)
    } catch (error) {
      return response.internalServerError('Could not retrieve file from storage')
    }
  }

  /**
   * --- Private Helper: Process File ---
   */
  private async processFileUpload(file: any, mailId: number, userId: number) {
    const uploadedAt = DateTime.now()
    const folderPath = `mail/${mailId}/${uploadedAt.toFormat('yyyy-MM-dd_HH-mm-ss')}`
    const sanitizedName = (file.clientName || 'document').replace(/[^a-zA-Z0-9._-]/g, '_')
    const fullPathKey = `${folderPath}/${sanitizedName}`

    const fileBuffer = await fs.promises.readFile(file.tmpPath!)
    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex')

    await file.moveToDisk(fullPathKey, 'localStoragePrivate')

    return await UploadedFile.create({
      filename: sanitizedName,
      fileSizeByte: file.size,
      uploadDate: uploadedAt,
      fileLocationPath: fullPathKey,
      uploadedByUserId: userId,
      sha256Checksum: checksum,
    })
  }

  /**
   * --- Private Helper: Get Dropdown Options ---
   */
  private async getRelationOptions() {
    const [types, priorities, codes] = await Promise.all([
      MailType.all(),
      MailPriority.all(),
      MailCode.all(),
    ])

    return {
      mailTypeOptions: types.map((t) => ({ value: t.id, label: t.name })),
      mailPriorityOptions: priorities.map((p) => ({ value: p.id, label: p.name })),
      mailCodeOptions: codes.map((c) => ({ value: c.id, label: `${c.code} - ${c.shortIndex}` })),
    }
  }

  async update({ params, request, response, auth, session }: HttpContext) {
    const mail = await Mail.findOrFail(params.mailId)
    const payload = await request.validateUsing(updateMailValidator)
    const authUser = auth.user!

    // Start a transaction to ensure data integrity
    const trx = await db.transaction()
    mail.useTransaction(trx)

    try {
      // 1. Update text fields
      mail.merge({
        mailSource: payload.mail_source,
        fullMailCode: payload.full_mail_code,
        agendaNumber: payload.agenda_number,
        mailDate: payload.mail_date ? DateTime.fromJSDate(payload.mail_date) : mail.mailDate,
        registeredAt: payload.registered_at ? DateTime.fromJSDate(payload.registered_at) : mail.registeredAt,
        mailPaperCount: payload.mail_paper_count,
        mailAttachmentPaperCount: payload.mail_attachment_paper_count,
        mailContentSummary: payload.mail_content_summary,
        mailTypeId: payload.mail_type_id,
        mailPriorityId: payload.mail_priority_id,
        mailCodeId: payload.mail_code_id,
      })

      // 2. Handle File Replacement
      const newFile = request.file('mail_file')
      if (newFile && newFile.isValid) {
        // Preload existing file to get the path for deletion
        await mail.load('uploadedMailFile')
        const oldFileRecord = mail.uploadedMailFile

        // Process and save the NEW file
        const uploadedFile = await this.processFileUpload(newFile, mail.id, authUser.id)
        mail.uploadedMailFileId = uploadedFile.id

        // Delete the OLD file from disk and database if it existed
        if (oldFileRecord) {
          await drive.use('localStoragePrivate').delete(oldFileRecord.fileLocationPath)
          await oldFileRecord.useTransaction(trx).delete()
        }
      }

      await mail.save()
      
      // Commit all changes
      await trx.commit()

      session.flash('notification', { type: 'success', message: 'Mail updated successfully' })
      return response.redirect().toRoute('mails.show', { mailId: mail.id })

    } catch (error) {
      // Rollback if anything fails
      await trx.rollback()
      session.flash('notification', { type: 'error', message: 'Failed to update record' })
      return response.redirect().back()
    }
  }
}