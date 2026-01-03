import Department from '#models/department'
import Organization from '#models/organization'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class DepartmentSeeder extends BaseSeeder {
  async run() {
    const organization = await Organization.query().where('short_name', 'DISKOMINFOS DENPASAR').firstOrFail()

    await Department.updateOrCreateMany('name', [
      { name: 'Penerima Surat', organization_id: organization.id, description: 'Penerima Surat' },
      { name: 'Sekretariat', organization_id: organization.id, description: 'Sekretariat' },
      { name: 'Keuangan', organization_id: organization.id, description: 'Keuangan' },
      { name: 'TIK', organization_id: organization.id, description: 'TIK' },
      { name: 'Persandian', organization_id: organization.id, description: 'Persandian' },
      { name: 'Arsip', organization_id: organization.id, description: 'Arsip' },
    ])
  }
}