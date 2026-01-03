import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
    async index({ view, request }: HttpContext) {
        return view.render('pages/dashboard', {
        })
    }
}