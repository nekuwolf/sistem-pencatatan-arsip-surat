import Department from '#models/department'
import Gender from '#models/gender'
import Organization from '#models/organization'
import RegisterInviteLink from '#models/register_invite_link'
import User from '#models/user'
import UserData from '#models/users_data'
import UserJobRole from '#models/users_job_role'
import { G_USER_ROLE, G_USER_STATUS_TAG } from '#start/globals'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { mapUserWithUserData } from '../../app/helpers/mapper/user_data_mapper.js'

export default class UserAdminSeeder extends BaseSeeder {
  async run() {
    const user = await User.findOrFailByEmailPreloadUserData('diskominfos.admin.sekretariat@admin.admin')
    const organization = await Organization.query().where('short_name', 'DISKOMINFOS DENPASAR').firstOrFail()
    const jobRole = await UserJobRole.query().where('short_name', 'Pegawai').firstOrFail()
    const department = await Department.query().where('name', 'Penerima Surat').firstOrFail()
    
    const newRegisterInviteLink = await RegisterInviteLink.createNewRegisterCode(
      user.id,
      department.id,
      G_USER_ROLE.EMPLOYEE.ID,
      jobRole.id,
      organization.id
    )

    console.log(`Created register code: ${newRegisterInviteLink.key}`)
  }
}
