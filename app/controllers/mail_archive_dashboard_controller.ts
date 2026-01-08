// import ArchiveEnvelope from '#models/archive_envelope'
// import Mail from '#models/mail'
// import MailArchiveStatus from '#models/mail_archive_status'
// import type { HttpContext } from '@adonisjs/core/http'

export default class MailArchiveDashboardController {
  /**
   * Display a list of resource
   */
  // async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  // async create({ view }: HttpContext) {
  //   const mails = await Mail.all()
  //   const envelopes = await ArchiveEnvelope.all()
  //   const statuses = await MailArchiveStatus.all()

  //   return view.render('pages/mail_archive/form', {
  //     isCreatingNew: true,
  //     mailOptions: mails.map((m) => ({ label: m.mailContentSummary, value: m.id })),
  //     envelopeOptions: envelopes.map((e) => ({ label: e.name, value: e.id })),
  //     statusOptions: statuses.map((s) => ({ label: s.name, value: s.id }))
  //   })
  // }

  /**
   * Handle form submission for the create action
   */
  // async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  // async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  // async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  // async destroy({ params }: HttpContext) {}
}