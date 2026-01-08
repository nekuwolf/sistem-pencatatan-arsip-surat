import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutController {
  /**
   * Display a list of resource
   */
  // async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  // async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ response, auth }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect().toRoute('auth.login.create')
  }

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