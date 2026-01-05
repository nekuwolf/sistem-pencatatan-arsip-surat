import Department from '#models/department'
import Organization from '#models/organization'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class DepartmentSeeder extends BaseSeeder {
  async run() {
    const organization = await Organization.query().where('short_name', 'DISKOMINFOS DENPASAR').firstOrFail()

    await Department.updateOrCreateMany('name', [
      { name: 'Penerima Surat', organizationId: organization.id, description: 'Penerima Surat' },
      { name: 'Sekretariat', organizationId: organization.id, description: 'Sekretariat' },
      { name: 'Keuangan', organizationId: organization.id, description: 'Keuangan' },
      { name: 'TIK', organizationId: organization.id, description: 'TIK' },
      { name: 'Persandian', organizationId: organization.id, description: 'Persandian' },
      { name: 'Arsip', organizationId: organization.id, description: 'Arsip' },
    ])
  }
}