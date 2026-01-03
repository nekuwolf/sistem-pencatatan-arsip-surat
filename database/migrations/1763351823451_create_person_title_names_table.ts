import { BaseSchema } from '@adonisjs/lucid/schema'

export default class PersonTitleNamesSchema extends BaseSchema {
  protected tableName = 'person_title_names'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table.string('title', 8).notNullable()
      table.integer('position').notNullable() // 1 pre name 2 post name
      table.string('description', 255).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
