import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import UserData from '#models/users_data'
import RegisterInviteLink from './register_invite_link.js'

export default class UserJobRole extends BaseModel {
  public static table = 'users_job_roles'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null
  
  @column()
  declare short_name: string | null

  @column()
  declare description?: string | null

  // A job role can be assigned to many users' data records
  @hasMany(() => UserData, { foreignKey: 'user_job_role_id' })
  declare user_data: HasMany<typeof UserData>
  
  // A job role can be assigned to many register invite link
  @hasMany(() => RegisterInviteLink, { foreignKey: 'new_user_job_role_id' })
  declare register_invite_link: HasMany<typeof RegisterInviteLink>
}