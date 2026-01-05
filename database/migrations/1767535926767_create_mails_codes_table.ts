import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mail_code'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code')
      table.string('short_index')
      table.text('description')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}