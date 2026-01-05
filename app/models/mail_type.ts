import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Mail from './mail.js'

export default class MailType extends BaseModel {
  public static table = 'mail_type'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  // A mail type can be assigned to many mail
  @hasMany(() => Mail, { foreignKey: 'mailPriorityId' })
  declare archiveEnvelope: HasMany<typeof Mail>
}