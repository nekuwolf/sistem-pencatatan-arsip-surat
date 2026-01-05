import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UploadedFilesSchema extends BaseSchema {
  protected tableName = 'uploaded_file'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('filename', 255).notNullable()
      table.integer('file_size_byte').notNullable()
      table.dateTime('upload_date').notNullable()
      table.string('file_location_path', 255).notNullable()
      table.integer('uploaded_by_user_id').notNullable().unsigned().references('id').inTable('user').onDelete('RESTRICT')
      table.string('sha_256_checksum', 64).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
