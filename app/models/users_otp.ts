import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class UserOtp extends BaseModel {
  public static table = 'users_otps'
  
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column()
  declare created_by_user_id: number

  @column()
  declare otp_code: string
  
  @column.dateTime()
  declare verified_time?: DateTime | null
  
  @column.dateTime()
  declare valid_from: DateTime
  
  @column.dateTime()
  declare valid_until: DateTime
  
  @column.dateTime()
  declare last_sent?: DateTime | null
  
  @column()
  declare creation_reason: string

  @belongsTo(() => User, { foreignKey: 'created_by_user_id' })
  declare created_by_user: BelongsTo<typeof User>
}
