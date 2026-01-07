import UsersRole from '#models/users_role'
import { G_USER_ROLE } from '#start/globals'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { resetAutoIncrement } from '../../app/helpers/reset_auto_increment.js'

export default class UserRoleSeeder extends BaseSeeder {
  async run() {
    // 1. Merge based on 'id' to ensure these specific IDs represent these roles
    await UsersRole.updateOrCreateMany('id', [
      { 
        id: G_USER_ROLE.ADMIN.ID,
        name: G_USER_ROLE.ADMIN.NAME,
        description: 'This user is an Admin and has full system privileges'
      },
      { 
        id: G_USER_ROLE.EMPLOYEE.ID,
        name: G_USER_ROLE.EMPLOYEE.NAME, 
        description: 'This user is an Employee and has limited system privileges'
      },
      { 
        id: G_USER_ROLE.NOT_EMPLOYEE.ID, 
        name: G_USER_ROLE.NOT_EMPLOYEE.NAME, 
        description: 'This user is NOT an Employee and has very limited system privileges'
      },
    ])

    await resetAutoIncrement(UsersRole.table, 100)
  }
}