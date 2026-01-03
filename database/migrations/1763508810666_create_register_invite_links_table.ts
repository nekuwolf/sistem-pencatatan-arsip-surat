import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'register_invite_links'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.integer('created_by_user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.dateTime('created_at').notNullable()
      table.dateTime('expire_at').notNullable()
      table.string('key', 6).notNullable()
      table.dateTime('used_at').nullable()
      table.integer('created_user_id').nullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('new_user_department_id').unsigned().references('id').inTable('departments').onDelete('RESTRICT')
      table.integer('new_user_role_id').unsigned().references('id').inTable('users_roles').onDelete('RESTRICT')
      table.integer('new_user_organization_id').unsigned().references('id').inTable('organizations').onDelete('RESTRICT')
      table.integer('new_user_job_role_id').unsigned().references('id').inTable('users_job_roles').onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}