import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersDatasAvatarsSchema extends BaseSchema {
  protected tableName = 'users_datas_avatars' // pivot table for users datas and uploaded files

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_data_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('uploaded_file_id').unsigned().references('id').inTable('uploaded_files').onDelete('CASCADE')
      table.dateTime('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
