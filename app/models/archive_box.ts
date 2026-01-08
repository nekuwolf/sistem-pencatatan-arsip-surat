import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ArchiveRackShelfOrder from '#models/archive_rack_shelf_order'
import ArchiveEnvelope from './archive_envelope.js'
// import Organization from './organization.js'
import Department from './department.js'
// import Organization from '#models/organization'
// import Department from '#models/department'

export default class ArchiveBox extends BaseModel {
  public static table = 'archive_box'
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare note: string | null

  @column()
  declare departmentId: number | null

  @column()
  declare rackShelfOrderId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Relationships ---

  // A box can only be placed in one rack/shelf position
  @belongsTo(() => ArchiveRackShelfOrder, { foreignKey: 'rackShelfOrderId' })
  declare rackShelfOrder: BelongsTo<typeof ArchiveRackShelfOrder>

  // A box can have many envelopes
  @hasMany(() => ArchiveEnvelope, { foreignKey: 'boxId' })
  declare archiveEnvelope: HasMany<typeof ArchiveEnvelope>

  // A user data can has one department
  @belongsTo(() => Department, { foreignKey: 'departmentId' })
  declare department: BelongsTo<typeof Department>
}