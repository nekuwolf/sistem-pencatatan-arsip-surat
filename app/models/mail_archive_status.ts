import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import MailArchive from './mail_archive.js'

export default class MailArchiveStatus extends BaseModel {
  public static table = 'mail_archive_status'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  // A mail archive status can be assigned to many mail archive
  @hasMany(() => MailArchive, { foreignKey: 'archiveStatusId' })
  declare mailArchive: HasMany<typeof MailArchive>
}