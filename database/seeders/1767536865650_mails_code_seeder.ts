import { BaseSeeder } from '@adonisjs/lucid/seeders'
// Adjust this import path if your model is located elsewhere
import MailCode from '#models/mail_code' 

export default class extends BaseSeeder {
  async run() {
    await MailCode.updateOrCreateMany('id', [
      {
        id: 1,
        code: '500.1',
        shortIndex: 'PEMINJAMAN SOUND SYSTEM',
        description: null,
      },
      {
        id: 2,
        code: '500.2',
        shortIndex: 'PEMINJAMAN PROYEKTOR',
        description: null,
      },
      {
        id: 3,
        code: '500.3',
        shortIndex: 'PEMINJAMAN KABEL PROYEKTOR',
        description: null,
      },
    ])
  }
}