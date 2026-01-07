import Department from '#models/department'
import Organization from '#models/organization'
import RegisterInviteLink from '#models/register_invite_link'
import User from '#models/user'
import UserJobRole from '#models/users_job_role'
import { G_USER_ROLE } from '#start/globals'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class RegisterInviteSeeder extends BaseSeeder {
  async run() {
    // 1. Fetch the constant data once
    const organization = await Organization.query().where('short_name', 'DISKOMINFOS DENPASAR').firstOrFail()
    const jobRole = await UserJobRole.query().where('short_name', 'Pegawai').firstOrFail()
    const department = await Department.query().where('name', 'Penerima Surat').firstOrFail()

    // 2. Fetch all users who have the ADMIN role
    const admins = await User.query().where('role_id', G_USER_ROLE.ADMIN.ID)

    if (admins.length === 0) {
      console.log('No admin users found. Please run UserAdminSeeder first.')
      return
    }

    // 3. Loop through each admin
    for (const admin of admins) {
      console.log(`--- Generating links for Admin: ${admin.email} ---`)

      // 4. Generate 10 links for the current admin
      for (let i = 1; i <= 10; i++) {
        const newRegisterInviteLink = await RegisterInviteLink.createNewRegisterCode(
          admin.id,          // The creator (admin)
          department.id,
          G_USER_ROLE.EMPLOYEE.ID,
          jobRole.id,
          organization.id
        )

        console.log(`[${i}] Created code: ${newRegisterInviteLink.key}`)
      }
    }
  }
}