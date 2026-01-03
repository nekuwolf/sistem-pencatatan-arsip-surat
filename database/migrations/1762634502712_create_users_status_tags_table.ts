import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersStatusTagsSchema extends BaseSchema {
  protected tableName = 'users_status_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name', 64).notNullable()
      table.string('description', 255).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
