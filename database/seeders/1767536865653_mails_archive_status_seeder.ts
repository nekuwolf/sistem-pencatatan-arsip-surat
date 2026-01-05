import { BaseSeeder } from '@adonisjs/lucid/seeders'
// Adjust the import path to match your project structure
import MailArchiveStatus from '#models/mail_archive_status' 

export default class extends BaseSeeder {
  async run() {
    await MailArchiveStatus.updateOrCreateMany('id', [
      {
        id: 1,
        name: 'Dimusnahkan',
        description: null,
      },
      {
        id: 2,
        name: 'Permanen',
        description: null,
      },
    ])
  }
}