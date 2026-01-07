import Department from '#models/department'
import Gender from '#models/gender'
import Organization from '#models/organization'
import User from '#models/user'
import UserJobRole from '#models/users_job_role'
import { G_USER_ROLE, G_USER_STATUS_TAG } from '#start/globals'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserAdminSeeder extends BaseSeeder {
  async run() {
    // 1. Fetch Shared Data (Optimize by fetching once)
    const organization = await Organization.query().where('short_name', 'DISKOMINFOS DENPASAR').firstOrFail()
    const jobRole = await UserJobRole.query().where('short_name', 'Pegawai').firstOrFail()
    const department = await Department.query().where('name', 'Penerima Surat').firstOrFail()
    const genders = await Gender.all()
    
    // Helper to get gender ID based on loop index
    const getGenderId = (i: number) => (i % 2 === 0 ? genders[0].id : genders[1].id)

    // 2. Define User Categories
    const categories = [
      { roleId: G_USER_ROLE.ADMIN.ID, prefix: 'admin', label: G_USER_ROLE.ADMIN.NAME },
      { roleId: G_USER_ROLE.EMPLOYEE.ID, prefix: 'employee', label: G_USER_ROLE.EMPLOYEE.NAME },
      { roleId: G_USER_ROLE.NOT_EMPLOYEE.ID, prefix: 'notemployee', label: G_USER_ROLE.NOT_EMPLOYEE.NAME },
    ]

    // 3. Main Loop
    for (const category of categories) {
      for (let i = 1; i <= 10; i++) {
        const email = `${category.prefix}${i}@seeder.seed`
        const fullName = `${category.label} ${i}`
        const password = 'password123'

        const user = await User.updateOrCreate(
          { email: email },
          {
            email: email,
            password: password,
            roleId: category.roleId,
            organizationId: organization.id,
            jobRoleId: jobRole.id,
            departmentId: department.id,
            genderId: getGenderId(i),
            fullName: fullName,
          }
        )

        // 4. Sync Status Tags
        await user.related('userStatusTag').sync([
          G_USER_STATUS_TAG.ACTIVE.ID,
          G_USER_STATUS_TAG.EMAILVERIFIED.ID
        ])
      }
    }
  }
}