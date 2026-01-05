import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Mail from './mail.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class MailCode extends BaseModel {
  public static table = 'mail_code'
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare shortIndex: string | null

  @column()
  declare description: string | null

  // A mail archive status can be assigned to many mail archive
  @hasMany(() => Mail, { foreignKey: 'mailCodeId' })
  declare mail: HasMany<typeof Mail>
}