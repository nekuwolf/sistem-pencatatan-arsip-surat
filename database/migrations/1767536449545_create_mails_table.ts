import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mail'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      
      // Adds created_at and updated_at
      table.timestamps(true, true)
      
      table.string('mail_source')
      table.string('full_mail_code')
      table.integer('agenda_number')
      table.date('mail_date')
      table.datetime('registered_at')
      table.integer('mail_paper_count')
      table.integer('mail_attachment_paper_count')
      table.text('mail_content_summary')
      
      // Fixed: Explicit table references
      table.integer('mail_type_id').unsigned().references('id').inTable('mail_type').onDelete('RESTRICT')
      table.integer('mail_priority_id').unsigned().references('id').inTable('mail_priority').onDelete('RESTRICT')
      table.integer('mail_code_id').unsigned().references('id').inTable('mail_code').onDelete('RESTRICT')
      table.integer('uploaded_mail_file_id').unsigned().references('id').inTable('uploaded_file').onDelete('RESTRICT')
      table.integer('created_by_user_id').unsigned().references('id').inTable('user').onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}