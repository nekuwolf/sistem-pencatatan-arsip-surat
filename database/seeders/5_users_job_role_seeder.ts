import UserJobRole from '#models/users_job_role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserJobRoleSeeder extends BaseSeeder {
  async run() {
    await UserJobRole.updateOrCreateMany('name', [
      { name: 'Kepala Dinas', short_name: 'Kadis', description: 'Kepala Dinas' },
      { name: 'Kepala Bidang', short_name: 'Kabid', description: 'Kepala Bidang' },
      { name: 'Kepala Sub Bagian', short_name: 'Kepala Sub Bagian', description: 'Kepala Sub Bagian' },
      { name: 'Pejabat Pelaksana Tugas', short_name: 'PLT', description: 'Pejabat Pelaksana Tugas' },
      { name: 'Pegawai', short_name: 'Pegawai', description: 'Pegawai' },
      { name: 'Mahasiswa PKL', short_name: 'Mahasiswa PKL', description: 'Mahasiswa PKL' },
      { name: 'Siswa PKL', short_name: 'Siswa PKL', description: 'Siswa PKL' },
    ])
  }
}