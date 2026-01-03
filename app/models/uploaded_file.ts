import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class UploadedFile extends BaseModel {
  public static table = 'uploaded_files'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare filename: string

  @column()
  declare file_size_byte: number

  @column.dateTime()
  declare upload_date: DateTime

  @column()
  declare file_location_path: string

  @column()
  declare uploaded_by_user_id: number

  @column()
  declare sha256_checksum: string | null

  // A file is uploaded by one user
  @belongsTo(() => User, { foreignKey: 'uploaded_by_user_id' })
  declare uploaded_by_user: BelongsTo<typeof User>
  
  // TODO: mails_datas.uploaded_file_id
  // // A file might be used as one user's avatar
  // @hasOne(() => UserAvatar, { foreignKey: 'uploaded_file_id' })
  // declare users_avatar: HasOne<typeof UserAvatar>
}