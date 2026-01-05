import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import MailType from '#models/mail_type'
import MailPriority from '#models/mail_priority'
import MailCode from '#models/mail_code'
import User from '#models/user' 
import UploadedFile from './uploaded_file.js'
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
  declare mailTypeId: number

  @column()
  declare mailPriorityId: number

  @column()
  declare mailCodeId: number

  @column()
  declare uploadedMailFileId: number | null

  @column()
  declare createdByUserId: number

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

  // An mail is created by an user, an user can have multiple mail
  @belongsTo(() => User, { foreignKey: 'createdByUserId' })
  declare createdByUser: BelongsTo<typeof User>

  // An mail is created by an user, an user can have multiple mail
  @hasOne(() => UploadedFile, { foreignKey: 'uploadedFileId' })
  declare uploadedMailFile: HasOne<typeof UploadedFile>
}