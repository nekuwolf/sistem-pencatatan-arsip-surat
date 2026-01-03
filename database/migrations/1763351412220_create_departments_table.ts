import { BaseSchema } from '@adonisjs/lucid/schema'

export default class DepartmentsSchema extends BaseSchema {
  protected tableName = 'departments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('organization_id').notNullable().unsigned().references('id').inTable('organizations').onDelete('RESTRICT')
      table.string('name', 128).notNullable()
      table.string('description', 255).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
