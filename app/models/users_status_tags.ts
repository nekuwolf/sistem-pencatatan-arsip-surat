import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserStatusTag extends BaseModel {
  public static table = 'users_status_tags'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null
}