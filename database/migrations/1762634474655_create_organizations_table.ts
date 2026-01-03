import { BaseSchema } from '@adonisjs/lucid/schema'

export default class OrganizationsSchema extends BaseSchema {
  protected tableName = 'organizations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name', 255).notNullable()
      table.string('short_name', 128).notNullable()
      table.string('description', 255).nullable()
      table.string('location_address', 255).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
