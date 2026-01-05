import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mail_archive'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true, true) // standardized timestamps

      table.integer('total_paper_archived')
      table.text('note')

      // Fixed: Explicit table references
      table.integer('mail_id').unsigned().references('id').inTable('mail').onDelete('RESTRICT')
      table.integer('envelope_id').unsigned().references('id').inTable('archive_envelope').onDelete('RESTRICT')
      table.integer('archive_status_id').unsigned().references('id').inTable('mail_archive_status').onDelete('RESTRICT')
      table.integer('created_by_user_id').unsigned().references('id').inTable('user').onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}