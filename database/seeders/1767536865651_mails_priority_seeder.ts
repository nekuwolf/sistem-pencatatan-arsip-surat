import { BaseSeeder } from '@adonisjs/lucid/seeders'
// Adjust the import path to match your project structure
import MailPriority from '#models/mail_priority' 

export default class extends BaseSeeder {
  async run() {
    await MailPriority.updateOrCreateMany('id', [
      {
        id: 1,
        name: 'Biasa',
        description: null,
      },
      {
        id: 2,
        name: 'Segera',
        description: null,
      },
      {
        id: 3,
        name: 'Sangat Segera',
        description: null,
      },
    ])
  }
}