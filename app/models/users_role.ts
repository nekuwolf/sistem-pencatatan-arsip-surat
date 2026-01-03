import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import UserData from '#models/users_data'
import RegisterInviteLink from './register_invite_link.js'

export default class UserRole extends BaseModel {
  public static table = 'users_roles'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description?: string | null

  // A user role can be assigned to many users data records
  @hasMany(() => UserData, { foreignKey: 'role_id' })
  declare user_data: HasMany<typeof UserData>

  // A user role can be assigned to many register invite link
  @hasMany(() => RegisterInviteLink, { foreignKey: 'new_user_role_id' })
  declare register_invite_link: HasMany<typeof RegisterInviteLink>
}