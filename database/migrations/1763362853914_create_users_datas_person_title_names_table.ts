import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersPersonTitleNamesSchema extends BaseSchema {
  protected tableName = 'users_datas_person_title_names' // pivot table for users_datas and person_title_names

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.integer('user_data_id').unsigned().references('id').inTable('users_datas').onDelete('CASCADE')

      table.integer('person_title_name_id').unsigned().references('id').inTable('person_title_names').onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
