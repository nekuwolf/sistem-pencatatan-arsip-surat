import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'register_invite_link'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.integer('created_by_user_id').notNullable().unsigned().references('id').inTable('user').onDelete('RESTRICT')
      table.timestamps(true, true)
      table.dateTime('expire_at').notNullable()
      table.string('key', 6).notNullable()
      table.dateTime('used_at').nullable()
      table.integer('created_user_id').nullable().unsigned().references('id').inTable('user').onDelete('RESTRICT')
      table.integer('new_user_department_id').unsigned().references('id').inTable('department').onDelete('RESTRICT')
      table.integer('new_user_role_id').unsigned().references('id').inTable('user_role').onDelete('RESTRICT')
      table.integer('new_user_organization_id').unsigned().references('id').inTable('organization').onDelete('RESTRICT')
      table.integer('new_user_job_role_id').unsigned().references('id').inTable('user_job_role').onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}