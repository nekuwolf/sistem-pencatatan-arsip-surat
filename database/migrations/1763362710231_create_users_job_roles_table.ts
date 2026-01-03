import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersJobRolesSchema extends BaseSchema {
  protected tableName = 'users_job_roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name')
      table.string('short_name')
      table.string('description')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
