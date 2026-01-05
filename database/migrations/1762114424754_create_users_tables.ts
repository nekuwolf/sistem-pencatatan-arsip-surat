import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'user'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.timestamps(true, true)
      table.string('nip', 255).nullable()
      table.string('full_name', 255).nullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 255).notNullable()
      table.string('personal_phone_number', 255).nullable().unique()
      table.date('birth_date').nullable()
      table.string('birth_place', 255).nullable()
      table.string('full_home_address', 255).nullable()
      table.integer('gender_id').unsigned().nullable().references('id').inTable('gender')
      table.integer('organization_id').unsigned().nullable().references('id').inTable('organization')
      table.integer('department_id').unsigned().nullable().references('id').inTable('department')
      table.integer('job_role_id').unsigned().nullable().references('id').inTable('user_job_role')
      table.integer('role_id').unsigned().nullable().references('id').inTable('user_role')
      table.integer('profile_picture_file_id').unsigned().nullable().references('id').inTable('uploaded_file').onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
