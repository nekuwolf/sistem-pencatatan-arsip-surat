import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import UserData from '#models/users_data'

export default class Gender extends BaseModel {
  public static table = 'genders'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  // A gender can be associated with many users' data records
  @hasMany(() => UserData, { foreignKey: 'gender_id' })
  declare user_data: HasMany<typeof UserData>
}