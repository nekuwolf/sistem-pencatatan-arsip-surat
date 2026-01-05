import { BaseSeeder } from '@adonisjs/lucid/seeders'
// Adjust the import path to match your project structure
import MailType from '#models/mail_type' 

export default class extends BaseSeeder {
  async run() {
    await MailType.updateOrCreateMany('id', [
      {
        id: 1,
        name: 'Surat Biasa',
        description: null,
      },
      {
        id: 2,
        name: 'Surat Undangan',
        description: null,
      },
      {
        id: 3,
        name: 'Surat Pengantar',
        description: null,
      },
      {
        id: 4,
        name: 'Surat Edaran',
        description: null,
      },
    ])
  }
}