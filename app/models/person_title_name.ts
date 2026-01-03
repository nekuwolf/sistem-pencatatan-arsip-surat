import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import UserData from './users_data.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class PersonTitleName extends BaseModel {
  public static table = 'person_title_names'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string
  
  @column()
  declare title: string

  @column()
  declare position: number

  @column()
  declare description: string | null

  // An person title name can have many user data 
  @hasMany(() => UserData, { foreignKey: 'person_title_name_id' })
  declare user_data: HasMany<typeof UserData>
}