import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import ArchiveBox from './archive_box.js'
import Organization from './organization.js'

export default class ArchiveRackShelfOrder extends BaseModel {
  public static table = 'archive_rack_shelf_order'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare rackName: string | null

  @column()
  declare shelfName: string | null

  @column()
  declare positionOrder: number | null

  @column()
  declare organizationId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // A shelf position can hold only one archive box
  @hasOne(() => ArchiveBox, { foreignKey: 'rackShelfOrderId' })
  declare box: HasOne<typeof ArchiveBox>

  // A rack shelf order belong to an organization
  @belongsTo(() => Organization, { foreignKey: 'organizationsId' })
  declare organization: BelongsTo<typeof Organization>
}