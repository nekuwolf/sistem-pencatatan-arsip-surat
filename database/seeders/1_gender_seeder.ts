import Gender from '#models/gender'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class GenderSeeder extends BaseSeeder {
  async run() {
    await Gender.updateOrCreateMany('name', [
      { name: 'Perempuan' },
      { name: 'Laki-Laki' },
    ])
  }
}
