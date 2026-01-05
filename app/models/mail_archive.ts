import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Mail from '#models/mail'
import ArchiveEnvelope from '#models/archive_envelope'
import MailArchiveStatus from '#models/mail_archive_status'
import User from '#models/user'

export default class MailArchive extends BaseModel {
  public static table = 'mail_archive'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare totalPaperArchived: number | null

  @column()
  declare note: string | null

  @column()
  declare mailId: number

  @column()
  declare envelopeId: number

  @column()
  declare archiveStatusId: number

  @column()
  declare createdByUserId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Relationships ---
  
  // An mail archive has one mail
  @hasOne(() => Mail, { foreignKey: 'mailId' })
  declare mail: HasOne<typeof Mail>

  // An mail archive can be assigned to one archive envelope, archive envelope have many mail archive 
  @belongsTo(() => ArchiveEnvelope, { foreignKey: 'envelopeId' })
  declare envelope: BelongsTo<typeof ArchiveEnvelope>

  // An mail archive can be assigned one mail archive status, mail archive status have many mail archive 
  @belongsTo(() => MailArchiveStatus, { foreignKey: 'archiveStatusId' })
  declare status: BelongsTo<typeof MailArchiveStatus>

  // An mail archive can be assigned one user, user can have many mail archive
  @belongsTo(() => User, { foreignKey: 'createdByUserId' })
  declare createdByUser: BelongsTo<typeof User>
}