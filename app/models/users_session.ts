import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class UserSession extends BaseModel {
  public static table = 'users_sessions'
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column.dateTime({ autoCreate: true })
  declare login_at: DateTime

  @column.dateTime()
  declare logout_at?: DateTime | null

  @column()
  declare session_token: string

  @column()
  declare ip_address: string

  @column()
  declare device_platform?: string | null

  @column()
  declare browser_version?: string | null

  @column()
  declare uuid: string

  @belongsTo(() => User, { foreignKey: 'user_id' })
  declare user: BelongsTo<typeof User>
}
