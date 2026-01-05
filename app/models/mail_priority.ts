import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Mail from './mail.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class MailPriority extends BaseModel {
  public static table = 'mail_priority'
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  // A mail priority can be assigned to many mail
  @hasMany(() => Mail, { foreignKey: 'mailPriorityId' })
  declare mail: HasMany<typeof Mail>
}