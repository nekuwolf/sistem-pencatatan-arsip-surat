import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import RegisterInviteLink from './register_invite_link.js'
import ArchiveRackShelfOrder from './archive_rack_shelf_order.js'
import User from './user.js'

export default class Organization extends BaseModel {
  public static table = 'organization'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string
  
  @column()
  declare shortName: string | null
  
  @column()
  declare description: string | null

  @column()
  declare locationAddress: string | null

  // An organization can have many users' data records
  @hasMany(() => User, { foreignKey: 'organizationId' })
  declare user: HasMany<typeof User>
  
  // An organization can have many register invite link
  @hasMany(() => RegisterInviteLink, { foreignKey: 'newUserOrganizationId' })
  declare registerInviteLink: HasMany<typeof RegisterInviteLink>
  
  // An organization can have many rack shelf order
  @hasMany(() => ArchiveRackShelfOrder, { foreignKey: 'organizationId' })
  declare archiveRackShelfOrder: HasMany<typeof ArchiveRackShelfOrder>
}