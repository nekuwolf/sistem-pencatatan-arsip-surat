import Department from '#models/department'
import Gender from '#models/gender'
import Organization from '#models/organization'
import User from '#models/user'
import UserJobRole from '#models/users_job_role'
import { G_USER_ROLE, G_USER_STATUS_TAG } from '#start/globals'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserAdminSeeder extends BaseSeeder {
  async run() {
    // --- First admin ---
    const admin1Email = 'diskominfos.admin.penerimasurat@admin.admin'
    const admin1Password = 'adminadmin'
    const admin1FullName = 'Admin Penerima Surat'

    const gender = await Gender.query().where('name', 'Laki-Laki').firstOrFail()
    const organization = await Organization.query().where('short_name', 'DISKOMINFOS DENPASAR').firstOrFail()
    const jobRole = await UserJobRole.query().where('short_name', 'Pegawai').firstOrFail()
    const department = await Department.query().where('name', 'Penerima Surat').firstOrFail()

    const userData1 = await User.updateOrCreate(
      { email: admin1Email },
      {
        email: admin1Email,
        password: admin1Password,
        roleId: G_USER_ROLE.ADMIN.ID,
        organizationId: organization.id,
        jobRoleId: jobRole.id,
        departmentId: department.id,
        genderId: gender.id,
        fullName: admin1FullName,
      }
    )

    await userData1
      .related('userStatusTag')
      .sync([
        G_USER_STATUS_TAG.ACTIVE.ID,
        G_USER_STATUS_TAG.EMAILVERIFIED.ID
      ])

    // --- Second admin ---
    const admin2Email = 'diskominfos.admin.sekretariat@admin.admin'
    const admin2Password = 'adminadmin'
    const admin2FullName = 'Admin Sekretariat'


    const userData2 = await User.updateOrCreate(
      { email: admin2Email },
      {
        email: admin2Email,
        password: admin2Password,
        roleId: G_USER_ROLE.ADMIN.ID,
        organizationId: organization.id, // same organization
        jobRoleId: jobRole.id,          // same job role
        departmentId: department.id,     // same or different department
        genderId: gender.id,
        fullName: admin2FullName,
      }
    )

    await userData2
      .related('userStatusTag')
      .sync([
        G_USER_STATUS_TAG.ACTIVE.ID,
        G_USER_STATUS_TAG.EMAILVERIFIED.ID
      ])
  }
}
