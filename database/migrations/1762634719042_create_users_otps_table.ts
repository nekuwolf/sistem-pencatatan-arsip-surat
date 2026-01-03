import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersOtpsSchema extends BaseSchema {
  protected tableName = 'users_otps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.dateTime('created_at').notNullable()
      table.integer('created_by_user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('otp_code', 6).notNullable()
      table.dateTime('verified_time').nullable()
      table.dateTime('valid_from').notNullable()
      table.dateTime('valid_until').notNullable()
      table.dateTime('last_sent').nullable()
      table.string('creation_reason').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
