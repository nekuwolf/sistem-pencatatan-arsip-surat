import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Gender extends BaseModel {
  public static table = 'gender'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  // A gender can be associated with many users' data records
  @hasMany(() => User, { foreignKey: 'genderId' })
  declare user: HasMany<typeof User>
}