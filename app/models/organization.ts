import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import UserData from '#models/users_data'
import RegisterInviteLink from './register_invite_link.js'

export default class Organization extends BaseModel {
  public static table = 'organizations'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string
  
  @column()
  declare short_name: string | null
  
  @column()
  declare description: string | null

  @column()
  declare location_address: string | null

  // An organization can have many users' data records
  @hasMany(() => UserData, { foreignKey: 'organization_id' })
  declare user_data: HasMany<typeof UserData>
  
  // An organization can have many register invite link
  @hasMany(() => RegisterInviteLink, { foreignKey: 'new_user_organization_id' })
  declare register_invite_link: HasMany<typeof RegisterInviteLink>
}