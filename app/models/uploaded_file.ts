import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Mail from './mail.js'

export default class UploadedFile extends BaseModel {
  public static table = 'uploaded_file'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare filename: string

  @column()
  declare fileSizeByte: number

  @column.dateTime()
  declare uploadDate: DateTime

  @column()
  declare fileLocationPath: string

  @column()
  declare uploadedByUserId: number

  @column()
  declare sha256Checksum: string | null

  // A file is uploaded by one user
  @belongsTo(() => User, { foreignKey: 'uploadedByUserId' })
  declare uploadedByUser: BelongsTo<typeof User>
  
  // For avatar profile picture image
  @hasOne(() => User, { foreignKey: 'profilePictureFileId' })
  declare profilePictureFile: HasOne<typeof User>

  // For mail file
  @hasOne(() => Mail, { foreignKey: 'uploadedMailFileId' })
  declare uploadedMailFile: HasOne<typeof Mail>
}