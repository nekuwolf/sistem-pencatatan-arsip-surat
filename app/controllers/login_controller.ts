import type { HttpContext } from '@adonisjs/core/http'
import { createLoginValidator, storeLoginValidator } from '#validators/login_validator'
import { mapVineJSValidationErrorMessages } from '../helpers/map_vinejs_validation_error_messages.js'
import router from '@adonisjs/core/services/router'
import User from '#models/user'
import { dd } from '@adonisjs/core/services/dumper'

export default class LoginController {
  /**
  * Display form to create a new record
  */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth, session }: HttpContext) {
    // 1. Validate
    // If this fails, Adonis automatically redirects back 
    // and flashes errors to the session. No try/catch needed.
    const { email, password } = await request.validateUsing(storeLoginValidator)

    try {
      // 2. Verify & Login
      // verifyCredentials checks the hash and throws if invalid
      const user = await User.verifyCredentials(email, password)
      
      // (Optional) If you specifically need your custom preloads:
      // await user.load('yourRelations') 

      await auth.use().login(user)

      return response.redirect().toRoute('mails.index')
      
    } catch (error) {
      // 3. Handle Bad Credentials
      // Flash a generic error message and redirect back to the login form
      session.flash('loginFormErrorMessage', 'Invalid credentials')
      return response.redirect().back()
    }
  }
}