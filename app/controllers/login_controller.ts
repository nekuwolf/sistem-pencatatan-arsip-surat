import type { HttpContext } from '@adonisjs/core/http'
import { storeLoginValidator } from '#validators/login_validator'
import User from '#models/user'

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
      
    // ... inside your store method
      } catch (error) {
        // 3. Handle Bad Credentials
        // Flash the error message
        session.flash('loginFormErrorMessage', 'Invalid credentials')
        // Flash all current request inputs EXCEPT the password for security
        session.flashExcept(['password']) 
        return response.redirect().back()
    }
  }
}