import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import MailType from '#models/mail_type'
import MailPriority from '#models/mail_priority'
import MailCode from '#models/mail_code'
import User from '#models/user' 
import UploadedFile from './uploaded_file.js'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import Department from './department.js'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
// import UploadedFile from '#models/uploaded_file' // Uncomment if you have this model

export default class Mail extends BaseModel {
  public static table = 'mail'
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare mailSource: string | null

  @column()
  declare fullMailCode: string | null

  @column()
  declare agendaNumber: number | null

  @column.date()
  declare mailDate: DateTime | null

  @column.dateTime()
  declare registeredAt: DateTime | null

  @column()
  declare mailPaperCount: number | null

  @column()
  declare mailAttachmentPaperCount: number | null

  @column()
  declare mailContentSummary: string | null

  @column()
  declare rackName: string | null
  
  @column()
  declare shelfName: string | null
  
  @column()
  declare boxName: string | null
  
  @column()
  declare envelopeName: string | null

  @column()
  declare mailTypeId: number

  @column()
  declare mailPriorityId: number

  @column()
  declare mailCodeId: number

  @column()
  declare uploadedMailFileId: number | null

  @column()
  declare createdByUserId: number
  
  @column()
  declare belongToDepartmentId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Relationships ---

  // An mail have one mail type, an mail type can be assigned to multiple mail
  @belongsTo(() => MailType, { foreignKey: 'mailTypeId' })
  declare mailType: BelongsTo<typeof MailType>

  // An mail have one mail priority, an mail priority can be assigned to multiple mail
  @belongsTo(() => MailPriority, { foreignKey: 'mailPriorityId' })
  declare mailPriority: BelongsTo<typeof MailPriority>

  // An mail have one mail code, an mail code can be assigned to multiple mail
  @belongsTo(() => MailCode, { foreignKey: 'mailCodeId' })
  declare mailCode: BelongsTo<typeof MailCode>

  // An mail is created by an user, an user can register multiple mail
  @belongsTo(() => User, { foreignKey: 'createdByUserId' })
  declare createdByUser: BelongsTo<typeof User>
  
  // An mail belong to an department, an department can have multiple mail
  @belongsTo(() => Department, { foreignKey: 'belongToDepartmentId' })
  declare belongToDepartment: BelongsTo<typeof Department>

  // An mail is created by an user, an user can have multiple mail
  @belongsTo(() => UploadedFile, { foreignKey: 'uploadedMailFileId' })
  declare uploadedMailFile: BelongsTo<typeof UploadedFile>

  public static searchConfig = [
    { value: 'agenda_number', label: 'No. Agenda', column: 'agendaNumber', type: 'text' },
    { value: 'mail_code', label: 'Kode Surat', column: 'fullMailCode', type: 'text' },
    { value: 'mail_source', label: 'Asal Surat', column: 'mailSource', type: 'text' },
    // Mark this as a date
    { value: 'mail_date', label: 'Tanggal Surat', column: 'mailDate', type: 'date' },
    // Add new ones here, and both View and Query update automatically!
  ]

  /**
   * Helper to apply search conditions dynamically
   */
  private static applySearch(
    query: ModelQueryBuilderContract<typeof Mail>, 
    searchQ: string | null, 
    searchBy: string | null
  ) {
    if (!searchQ) return
    
    // Default search term
    let q = `%${searchQ}%`

    // 1. Helper to detect and flip dates if necessary
    // If user types "31/12/2024", we convert q to "%2024-12-31%"
    const getSearchTerm = (type?: string) => {
      if (type === 'date') {
        // Try to parse common Indonesian/UK formats
        // Add other formats here if needed, e.g. 'dd-MM-yyyy'
        const dt = DateTime.fromFormat(searchQ, 'dd/MM/yyyy') 
        
        if (dt.isValid) {
          return `%${dt.toISODate()}%` // Returns 2024-12-31
        }
        // If parsing fails (e.g. user just typed "2024"), return original q
        return q
      }
      return q
    }

    query.where((group) => {
      // 2. Lookup config
      const config = this.searchConfig.find(c => c.value === searchBy)

      if (config) {
        // Specific Search
        // We calculate the specific 'q' for this column type
        group.where(config.column, 'like', getSearchTerm(config.type))
      } 
      else {
        // 3. "All" Search
        this.searchConfig.forEach((c) => {
          // We dynamically calculate 'q' for every column we loop through
          group.orWhere(c.column, 'like', getSearchTerm(c.type))
        })

        // Extra fields
        group.orWhere('mail_content_summary', 'like', q)
      }
    })
  }

  public static async allMailInDepartmentIdPreloadEverythingPaginate(
    departmentId: number,
    currentPage: number,
    // Add search params here
    searchQ: string = '', 
    searchBy: string = 'all',
    itemPerPage?: number,
    client?: TransactionClientContract
  ) {
    const query = this.query({ client })
      .where('belong_to_department_id', departmentId)
      .preload('mailType')
      .preload('mailPriority')
      .preload('uploadedMailFile')
      .preload('mailCode')
      .preload('createdByUser')
      .orderBy('mail.created_at', 'desc')

    // Apply Search
    this.applySearch(query, searchQ, searchBy)

    return await query.paginate(currentPage, itemPerPage || 10)
  }

  public static async allMailByUserIdPreloadEverythingPaginate(
    userId: number,
    currentPage: number,
    // Add search params here
    searchQ: string = '', 
    searchBy: string = 'all',
    itemPerPage?: number,
    client?: TransactionClientContract
  ) {
    const query = this.query({ client })
      .where('created_by_user_id', userId)
      .preload('mailType')
      .preload('mailPriority')
      .preload('uploadedMailFile')
      .preload('mailCode')
      .preload('createdByUser')
      .orderBy('created_at', 'desc')

    // Apply Search
    this.applySearch(query, searchQ, searchBy)

    return await query.paginate(currentPage, itemPerPage || 10)
  }

}