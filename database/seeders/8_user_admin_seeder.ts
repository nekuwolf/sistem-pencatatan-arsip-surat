import Department from '#models/department'
import Gender from '#models/gender'
import Organization from '#models/organization'
import User from '#models/user'
import UserData from '#models/users_data'
import UserJobRole from '#models/users_job_role'
import { G_USER_ROLE, G_USER_STATUS_TAG } from '#start/globals'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserAdminSeeder extends BaseSeeder {
  async run() {
    // --- First admin ---
    const admin1Email = 'diskominfos.admin.penerimasurat@admin.admin'
    const admin1Password = 'adminadmin'
    const admin1FullName = 'Admin Penerima Surat'

    const user1 = await User.updateOrCreate({ id: 1 }, {})
    const gender = await Gender.query().where('name', 'Laki-Laki').firstOrFail()
    const organization = await Organization.query().where('short_name', 'DISKOMINFOS DENPASAR').firstOrFail()
    const jobRole = await UserJobRole.query().where('short_name', 'Pegawai').firstOrFail()
    const department = await Department.query().where('name', 'Penerima Surat').firstOrFail()

    const userData1 = await UserData.updateOrCreate(
      { email: admin1Email },
      {
        user_id: user1.id,
        email: admin1Email,
        password: admin1Password,
        role_id: G_USER_ROLE.ADMIN.ID,
        organization_id: organization.id,
        job_role_id: jobRole.id,
        department_id: department.id,
        gender_id: gender.id,
        full_name: admin1FullName,
      }
    )

    await userData1
      .related('user_status_tag')
      .sync([
        G_USER_STATUS_TAG.ACTIVE.ID,
        G_USER_STATUS_TAG.EMAILVERIFIED.ID
      ])

    // --- Second admin ---
    const admin2Email = 'diskominfos.admin.sekretariat@admin.admin'
    const admin2Password = 'adminadmin'
    const admin2FullName = 'Admin Sekretariat'

    const user2 = await User.updateOrCreate({ id: 2 }, {})

    const userData2 = await UserData.updateOrCreate(
      { email: admin2Email },
      {
        user_id: user2.id,
        email: admin2Email,
        password: admin2Password,
        role_id: G_USER_ROLE.ADMIN.ID,
        organization_id: organization.id, // same organization
        job_role_id: jobRole.id,          // same job role
        department_id: department.id,     // same or different department
        gender_id: gender.id,
        full_name: admin2FullName,
      }
    )

    await userData2
      .related('user_status_tag')
      .sync([
        G_USER_STATUS_TAG.ACTIVE.ID,
        G_USER_STATUS_TAG.EMAILVERIFIED.ID
      ])
  }
}
