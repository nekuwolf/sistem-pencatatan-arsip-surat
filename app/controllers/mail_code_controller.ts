import MailCode from '#models/mail_code'
import type { HttpContext } from '@adonisjs/core/http'

export default class MailCodesController {
  public async index({ request, response }: HttpContext) {
    // 1. Get the search term
    const searchTerm = request.input('q')

    // 2. Determine the limit based on the presence of q
    const limit = searchTerm ? 30 : 10

    // 3. Build the query
    const query = MailCode.query()

    if (searchTerm) {
      // Use 'ilike' for case-insensitive search (PostgreSQL) 
      // or 'like' for MySQL/SQLite
      query.where('shortIndex', 'like', `%${searchTerm}%`)
    }

    // 4. Execute with the dynamic limit
    const mailCodes = await query.limit(limit)

    // 5. Transform for the frontend
    const formattedData = mailCodes.map((item) => ({
      value: item.id,
      label: `${item.code} - ${item.shortIndex ?? ''}`,
    }))

    return response.ok(formattedData)
  }
}