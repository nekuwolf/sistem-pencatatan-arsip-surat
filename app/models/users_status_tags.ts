import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UsersStatusTag extends BaseModel {
  public static table = 'user_status_tag'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null
}