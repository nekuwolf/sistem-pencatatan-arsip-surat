import PersonTitleName from '#models/person_title_name'
import { G_TITLE_NAME_POSITION } from '#start/globals'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class PersonTitleNameSeeder extends BaseSeeder {
  async run() {
    await PersonTitleName.updateOrCreateMany('title', [
      // { name: 'TITLE_HERE', position: G_TITLE_NAME_POSITION.PRE (pre) or G_TITLE_NAME_POSITION.POST (post), description: 'SHORT_DESCRIPTION' },
      { name: 'Sarjana Teknik', title: 'S.T.', position: G_TITLE_NAME_POSITION.POST, description: 'Sarjana Teknik (Bachelor of Engineering)' },
      { name: 'Magister Komputer', title: 'M.Kom.', position: G_TITLE_NAME_POSITION.POST, description: 'Magister Komputer (Master of Computer Science)' },
      { name: 'Doktor', title: 'Dr.', position: G_TITLE_NAME_POSITION.PRE, description: 'Doktor (Doctorate degree)' },
      { name: 'Profesor', title: 'Prof.', position: G_TITLE_NAME_POSITION.PRE, description: 'Profesor (Professor)' },
      { name: 'Insinyur', title: 'Ir.', position: G_TITLE_NAME_POSITION.PRE, description: 'Insinyur (Engineer - professional degree)' },
      { name: 'Sarjana Ekonomi', title: 'S.E.', position: G_TITLE_NAME_POSITION.POST, description: 'Sarjana Ekonomi (Bachelor of Economics)' },
      { name: 'Magister Manajemen', title: 'M.M.', position: G_TITLE_NAME_POSITION.POST, description: 'Magister Manajemen (Master of Management)' },
      { name: 'Sarjana Hukum', title: 'S.H.', position: G_TITLE_NAME_POSITION.POST, description: 'Sarjana Hukum (Bachelor of Laws)' },
      { name: 'Doctor of Philosophy', title: 'Ph.D.', position: G_TITLE_NAME_POSITION.POST, description: 'Doctor of Philosophy (Doctorate degree)' },
      { name: 'Sarjana Komputer', title: 'S.Kom.', position: G_TITLE_NAME_POSITION.POST, description: 'Sarjana Komputer (Bachelor of Computer Science)' },
      { name: 'Magister Teknik', title: 'M.T.', position: G_TITLE_NAME_POSITION.POST, description: 'Magister Teknik (Master of Engineering)' },
      { name: 'Sarjana Ilmu Komunikasi', title: 'S.I.Kom.', position: G_TITLE_NAME_POSITION.POST, description: 'Sarjana Ilmu Komunikasi (Bachelor of Communication Science)' },
      { name: 'Magister Bisnis', title: 'M.B.A.', position: G_TITLE_NAME_POSITION.POST, description: 'Magister Bisnis (Master of Business Administration)' },
      { name: 'Sarjana Pendidikan', title: 'S.Pd.', position: G_TITLE_NAME_POSITION.POST, description: 'Sarjana Pendidikan (Bachelor of Education)' },
      { name: 'Magister Sains', title: 'M.Sc.', position: G_TITLE_NAME_POSITION.POST, description: 'Magister Sains (Master of Science)' },
      { name: 'Sarjana Ilmu Politik', title: 'S.I.P.', position: G_TITLE_NAME_POSITION.POST, description: 'Sarjana Ilmu Politik (Bachelor of Political Science)' },
      { name: 'Magister Humaniora', title: 'M.A.', position: G_TITLE_NAME_POSITION.POST, description: 'Magister Humaniora (Master of Arts)' },
      { name: 'Dokter', title: 'dr.', position: G_TITLE_NAME_POSITION.PRE, description: 'Dokter (Medical Doctor - general practitioner)' },
      { name: 'Dokter Gigi', title: 'drg.', position: G_TITLE_NAME_POSITION.PRE, description: 'Dokter Gigi (Dentist)' },
      { name: 'Sarjana Keperawatan', title: 'S.Kep.', position: G_TITLE_NAME_POSITION.POST, description: 'Sarjana Keperawatan (Bachelor of Nursing)' },
      { name: 'Sarjana Farmasi', title: 'S.Farm.', position: G_TITLE_NAME_POSITION.POST, description: 'Sarjana Farmasi (Bachelor of Pharmacy)' },
      { name: 'Magister Farmasi', title: 'M.Farm.', position: G_TITLE_NAME_POSITION.POST, description: 'Magister Farmasi (Master of Pharmacy)' },
      { name: 'Sarjana Gizi', title: 'S.Gz.', position: G_TITLE_NAME_POSITION.POST, description: 'Sarjana Gizi (Bachelor of Nutrition)' },
      { name: 'Akuntan', title: 'Ak.', position: G_TITLE_NAME_POSITION.PRE, description: 'Akuntan (Accountant - professional designation)' }
    ])
  }
}