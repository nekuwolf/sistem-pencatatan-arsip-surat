// database/seeders/1767536865642_organization_seeder.ts
import Organization from '#models/organization'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class OrganizationSeeder extends BaseSeeder {
  async run() {
    await Organization.updateOrCreateMany('name', [
      { 
        name: 'Dinas Komunikasi, Informatika dan Statistik Pemerintah Kota Denpasar', 
        shortName: 'DISKOMINFOS DENPASAR', 
        description: 'Dinas Komunikasi, Informatika dan Statistik Pemerintah Kota Denpasar', 
        locationAddress: 'Lantai 3, Gedung Graha Sewaka Dharma, Jl. Majapahit No.1, Dauh Puri Kaja, Kec. Denpasar Utara, Kota Denpasar, Bali 80231' 
      },
    ])
  }
}