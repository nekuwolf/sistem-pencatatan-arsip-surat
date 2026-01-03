import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import UserData from '#models/users_data'
import RegisterInviteLink from './register_invite_link.js'
import Organization from './organization.js'

export default class Department extends BaseModel {
  public static table = 'departments'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organization_id: number
  
  @column()
  declare name: string

  @column()
  declare description: string | null

  // A department only have one organization
  @belongsTo(() => Organization, { foreignKey: 'organization_id' })
  declare organization: BelongsTo<typeof Organization>

  // A department can be assigned to many users' data records
  @hasMany(() => UserData, { foreignKey: 'department_id' })
  declare user_data: HasMany<typeof UserData>
  
  // A department can be assigned to many register invite link
  @hasMany(() => RegisterInviteLink, { foreignKey: 'new_user_department_id' })
  declare register_invite_link: HasMany<typeof RegisterInviteLink>
}