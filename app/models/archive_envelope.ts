import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ArchiveBox from '#models/archive_box'
import MailArchive from './mail_archive.js'
import Organization from './organization.js'
import Department from './department.js'

export default class ArchiveEnvelope extends BaseModel {
  public static table = 'archive_envelope'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare note: string | null

  @column()
  declare departmentId: number | null

  @column()
  declare boxId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Relationships ---

  // An envelope belongs to a box, a box has many envelope
  @belongsTo(() => ArchiveBox, { foreignKey: 'boxId' })
  declare archiveBox: BelongsTo<typeof ArchiveBox>

  // An envelope has many archived mail, an mail archive can only be stored into an envelope
  @hasMany(() => MailArchive, { foreignKey: 'envelopeId' })
  declare archiveData: HasMany<typeof MailArchive>
  
  // An envelope belongs to an department, a department have many envelope
  @belongsTo(() => Department, { foreignKey: 'departmentId' })
  declare department: BelongsTo<typeof Department>
}