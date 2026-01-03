import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersSessionsSchema extends BaseSchema {
  protected tableName = 'users_sessions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.dateTime('login_at').notNullable()
      table.dateTime('logout_at').nullable()
      table.string('session_token', 255).notNullable()
      table.string('ip_address', 15).notNullable()
      table.string('device_platform', 128).nullable()
      table.string('browser_version', 128).nullable()
      table.string('uuid', 128).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
