import Department from '#models/department'
import Organization from '#models/organization'
import RegisterInviteLink from '#models/register_invite_link'
import User from '#models/user'
import UserJobRole from '#models/users_job_role'
import { G_USER_ROLE, G_USER_STATUS_TAG } from '#start/globals'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserAdminSeeder extends BaseSeeder {
  async run() {
    const email = 'diskominfos.admin.sekretariat@admin.admin'
    const user = await User.findByOrFail('email', email)
    const organization = await Organization.query().where('short_name', 'DISKOMINFOS DENPASAR').firstOrFail()
    const jobRole = await UserJobRole.query().where('short_name', 'Pegawai').firstOrFail()
    const department = await Department.query().where('name', 'Penerima Surat').firstOrFail()
    
    for (let i = 1; i <= 10; i++) {
      const newRegisterInviteLink = await RegisterInviteLink.createNewRegisterCode(
        user.id,
        department.id,
        G_USER_ROLE.EMPLOYEE.ID,
        jobRole.id,
        organization.id
      )
  
      console.log(`Created register code (${i}): ${newRegisterInviteLink.key} owned by ${email}`)
    }

  }
}
