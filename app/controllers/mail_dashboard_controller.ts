import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import fs from 'node:fs'
import crypto from 'node:crypto'
import Mail from '#models/mail'
import MailType from '#models/mail_type'
import MailPriority from '#models/mail_priority'
import MailCode from '#models/mail_code'
import UploadedFile from '#models/uploaded_file'
import { createMailValidator, updateMailValidator } from '#validators/mail_validator'
import drive from '@adonisjs/drive/services/main'
import db from '@adonisjs/lucid/services/db'
import { mapMailsDatasToDesktopTableMobileListEdgeView } from '../helpers/mail_data_edge_mapper.js'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class MailDashboardController {
  
  /**
   * 1. Display list
   */
  async index({ view, request, auth }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    
    // 1. Get Search Params
    const searchQ = request.input('search_q', '')
    const searchBy = request.input('search_by', 'all')

    let paginatorResult

    if (user.isAdmin || user.isEmployee || user.isNotEmployee) {
      paginatorResult = await Mail.allMailInDepartmentIdPreloadEverythingPaginate(
        user.organizationId,
        page,
        searchQ,  // Pass param
        searchBy  // Pass param
      )
    } else {
      paginatorResult = await Mail.allMailByUserIdPreloadEverythingPaginate(
        user.id,
        page,
        searchQ, // Pass param
        searchBy // Pass param
      )
    }

    // 2. Persist query string (Keep search active on pagination links)
    paginatorResult.baseUrl(request.url())
    paginatorResult.queryString(request.qs())

    const mailTableDatas = mapMailsDatasToDesktopTableMobileListEdgeView(
      paginatorResult.all()
    )

    const searchOptions = [
      { value: 'all', label: 'Semua' },
      ...Mail.searchConfig 
    ]

    return view.render('pages/mail/index', {
      mailTableDatas,
      paginator: paginatorResult,
      searchOptions, // Pass the combined list
    })
  }

  /**
   * 2. Show Create Form
   */
  async create({ view }: HttpContext) {
    // We need options for the dropdowns in create.edge
    const { mailTypeOptions, mailPriorityOptions, mailCodeOptions } = await this.getRelationOptions()
    
    return view.render('pages/mail/create', {
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

    const trx = await db.transaction()

    try {
      // 1. Create the Mail record
      const mail = new Mail()
      mail.useTransaction(trx)
      
      mail.fill({
        mailSource: payload.mail_source,
        fullMailCode: payload.full_mail_code,
        agendaNumber: payload.agenda_number,
        mailDate: payload.mail_date ? DateTime.fromJSDate(payload.mail_date) : undefined,
        registeredAt: payload.registered_at ? DateTime.fromJSDate(payload.registered_at) : undefined,
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
        envelopeName: payload.envelope_name,
        belongToDepartmentId: authUser.departmentId
      })
      
      await mail.save()

      // 2. Handle File Upload if present
      const file = request.file('mail_file')
      if (file && file.isValid) {
        const uploadedFile = await this.processFileUpload(file, mail.id, authUser.id, trx)
        mail.uploadedMailFileId = uploadedFile.id
        await mail.save() // Update with file ID
      }

      await trx.commit()

      session.flash('notification', { type: 'success', message: 'Arsip surat berhasil disimpan.' })
      return response.redirect().toRoute('mails.show', { mailId: mail.id })

    } catch (error) {
      await trx.rollback()
      session.flash('notification', { type: 'error', message: 'Gagal menyimpan arsip surat.' })
      return response.redirect().back()
    }
  }

  /**
   * 4. Show Detail OR Edit Form
   * Handles logic based on your `show.edge` "Edit Data" button
   */
  async show({ params, view, request, response }: HttpContext) {
    // 1. Fetch the mail with all necessary relationships
    const mail = await Mail.query()
      .where('id', params.mailId)
      .preload('mailType')
      .preload('mailPriority')
      .preload('mailCode')
      .preload('uploadedMailFile')
      .preload('createdByUser') 
      .firstOrFail()

    // 2. Check if the 'edit' query param exists (?edit=true)
    // Your show.edge button links to: route('mails.show', ..., { qs: { edit: 'true' } })
    const isEditing = request.input('edit') === 'true'

    // 3. IF EDITING: Render 'edit.edge' with options
    if (isEditing) {
      const options = await this.getRelationOptions(mail)
      return view.render('pages/mail/edit', {
        mail,
        ...options 
      })
    }

    // 4. IF VIEWING: Render 'show.edge'
    return view.render('pages/mail/show', {
      mail
    })
  }

  /**
   * 5. Update Mail (Handle File Replacement)
   */
  async update({ params, request, response, auth, session }: HttpContext) {
    const mail = await Mail.findOrFail(params.mailId)
    const payload = await request.validateUsing(updateMailValidator)
    const authUser = auth.user!

    // Start a transaction
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
        rackName: payload.rack_name,
        shelfName: payload.shelf_name,
        boxName: payload.box_name,
        envelopeName: payload.envelope_name,
      })

      // 2. Handle File Replacement
      const newFile = request.file('mail_file')
      
      if (newFile && newFile.isValid) {
        // 1. Load existing file record
        await mail.load('uploadedMailFile')
        const oldFileRecord = mail.uploadedMailFile

        // 2. Process and save the NEW file
        const uploadedFile = await this.processFileUpload(newFile, mail.id, authUser.id, trx)
        
        // 3. Update AND Save the mail record first
        mail.uploadedMailFileId = uploadedFile.id
        await mail.useTransaction(trx).save() // <--- CRITICAL: Persist the change to DB

        // 4. Now safe to delete the OLD file
        if (oldFileRecord) {
          // Remove physical file
          await drive.use('localStoragePrivate').delete(oldFileRecord.fileLocationPath)
          
          // Remove DB record
          await oldFileRecord.useTransaction(trx).delete()
        }
      }

      await mail.save()
      await trx.commit()

      session.flash('notification', { type: 'success', message: 'Data surat berhasil diperbarui.' })
      return response.redirect().toRoute('mails.show', { mailId: mail.id })

    } catch (error) {
      await trx.rollback()
      console.error(error)
      session.flash('notification', { type: 'error', message: 'Gagal memperbarui data surat.' })
      return response.redirect().back()
    }
  }

  /**
   * 6. Stream/Download File
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
      const metaData = await disk.getMetaData(key)
      const stream = await disk.getStream(key)

      response.header('Content-Type', metaData.contentType || 'application/octet-stream')
      response.header('Content-Length', metaData.contentLength)
      response.header('Content-Disposition', `inline; filename="${mail.uploadedMailFile.filename}"`)

      return response.stream(stream)
    } catch (error) {
      return response.internalServerError('Could not retrieve file from storage')
    }
  }

  /**
   * Helper: Process File Upload
   */
  private async processFileUpload(file: any, mailId: number, userId: number, client?: TransactionClientContract) {
    const uploadedAt = DateTime.now()
    const folderPath = `mail/${mailId}/${uploadedAt.toFormat('yyyy-MM-dd_HH-mm-ss')}`
    
    // Sanitize filename
    const sanitizedName = (file.clientName || 'document').replace(/[^a-zA-Z0-9._-]/g, '_')
    const fullPathKey = `${folderPath}/${sanitizedName}`

    // Calculate Checksum (optional but good for integrity)
    const fileBuffer = await fs.promises.readFile(file.tmpPath!)
    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex')

    // Move to Drive
    await file.moveToDisk(fullPathKey, 'localStoragePrivate')

    // Create DB Record
    return await UploadedFile.create({
      filename: sanitizedName,
      fileSizeByte: file.size,
      uploadDate: uploadedAt,
      fileLocationPath: fullPathKey,
      uploadedByUserId: userId,
      sha256Checksum: checksum,
    }, { client: client })
  }

  /**
   * Helper: Get Dropdown Options
   */
  private async getRelationOptions(mail?: Mail) {
    const [types, priorities, codes] = await Promise.all([
      MailType.all(),
      MailPriority.all(),
      MailCode.all(),
    ])

    return {
      mailTypeOptions: types.map((t) => ({ value: t.id, label: t.name, isSelected: t.id === mail?.mailTypeId })),
      mailPriorityOptions: priorities.map((p) => ({ value: p.id, label: p.name, isSelected: p.id === mail?.mailPriorityId })),
      mailCodeOptions: codes.map((c) => ({ value: c.id, label: `${c.code} - ${c.shortIndex}`, isSelected: c.id === mail?.mailCodeId })),
    }
  }
}