import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import RegisterInviteLink from './register_invite_link.js'
import User from './user.js'

export default class UserRole extends BaseModel {
  public static table = 'user_role'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description?: string | null

  // A user role can be assigned to many users data records
  @hasMany(() => User, { foreignKey: 'role_id' })
  declare user_data: HasMany<typeof User>

  // A user role can be assigned to many register invite link
  @hasMany(() => RegisterInviteLink, { foreignKey: 'new_user_role_id' })
  declare register_invite_link: HasMany<typeof RegisterInviteLink>
}