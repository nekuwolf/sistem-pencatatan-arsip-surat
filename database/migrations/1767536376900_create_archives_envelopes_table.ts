import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'archive_envelope'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.text('note')

      table.integer('organization_id').unsigned().nullable().references('id').inTable('organization').onDelete('RESTRICT')
      table.integer('department_id').unsigned().nullable().references('id').inTable('department').onDelete('RESTRICT')
      table.integer('box_id').unsigned().references('archives_box.id').onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}