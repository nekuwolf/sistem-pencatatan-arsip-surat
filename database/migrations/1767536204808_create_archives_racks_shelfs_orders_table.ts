import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'archive_rack_shelf_order'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true, true) // Added timestamps

      table.string('rack_name')
      table.string('shelf_name') // Changed to string for safety
      table.integer('position_order')
      
      table.integer('organization_id').unsigned().nullable().references('id').inTable('organization').onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}