import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersStatusesSchema extends BaseSchema {
  protected tableName = 'users_datas_statuses' // pivot table for users_datas and users_status_tags

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.integer('user_data_id').unsigned().references('id').inTable('users_datas').onDelete('CASCADE')

      table.integer('user_status_tag_id').unsigned().references('id').inTable('users_status_tags').onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
