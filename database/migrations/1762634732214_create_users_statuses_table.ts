import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersStatusesSchema extends BaseSchema {
  protected tableName = 'user_status' // pivot table for users and users_status_tags

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.integer('user_id').notNullable().unsigned().references('id').inTable('user').onDelete('RESTRICT')

      table.integer('user_status_tag_id').notNullable().unsigned().references('id').inTable('user_status_tag').onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
