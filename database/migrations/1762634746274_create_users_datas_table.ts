import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersDatasSchema extends BaseSchema {
  protected tableName = 'users_datas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')

      table.dateTime('created_at').notNullable()
      table.string('full_name', 255).nullable()
      table.string('email', 255).notNullable()
      table.string('password', 255).notNullable()

      table.string('personal_phone_number', 255).nullable()
      table.date('birth_date').nullable()
      table.string('birth_place', 255).nullable()
      table.string('full_home_address', 255).nullable()

      table.integer('gender_id').unsigned().nullable().references('id').inTable('genders')
      table.integer('role_id').unsigned().nullable().references('id').inTable('users_roles')
      table.integer('organization_id').unsigned().nullable().references('id').inTable('organizations')
      table.integer('job_role_id').unsigned().nullable().references('id').inTable('users_job_roles')
      table.integer('department_id').unsigned().nullable().references('id').inTable('departments')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
