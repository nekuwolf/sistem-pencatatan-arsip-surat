import { BaseSchema } from '@adonisjs/lucid/schema'

export default class GendersSchema extends BaseSchema {
  protected tableName = 'gender'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name', 255).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
