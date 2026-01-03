import type { HttpContext } from '@adonisjs/core/http'
import { createLoginValidator, storeLoginValidator } from '#validators/login_validators'
import { mapVineJSValidationErrorMessages } from '../helpers/map_vinejs_validation_error_messages.js'
import router from '@adonisjs/core/services/router'
import User from '#models/user'
import UserData from '#models/users_data'

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
  async store({ request, view, response, auth }: HttpContext) {
    const isHx = request.header('hx-request') ? true : false
    let rawData = request.only(['email', 'password'])
    
    try {
      const validatedData = await request.validateUsing(storeLoginValidator)

      try {
        const user = await UserData.findByEmailPassword(validatedData.email, validatedData.password)
        
        await auth.use().login(user)
        
        return isHx
          ? response.header('hx-redirect', router.makeUrl('mail.index')).noContent()
          : response.redirect().toRoute('mail.index')
      } catch (error) {
        return isHx
          ? await view.render('components/form/login', {
              emailValue: rawData.email || '',
              passwordValue: rawData.password || '',
              loginFormErrorMessage: 'Email or password is invalid'
            })
            : response.ok(
              await view.render('pages/auth/login', {
                emailValue: rawData.email || '',
                passwordValue: rawData.password || '',
                loginFormErrorMessage: 'Email or password is invalid'
              })
            )
      }
      
    } catch (error) {
      if (error.code !== 'E_VALIDATION_ERROR') {
        throw error
      }
      
      const errorMessages = mapVineJSValidationErrorMessages(error)

      return isHx
        ? await view.render('components/form/login', {
            emailValue: rawData.email || '',
            emailErrorMessage: errorMessages?.email || '',
            passwordValue: rawData.password || '',
            passwordErrorMessage: errorMessages?.password || '',
          })
        : response.ok(
            await view.render('pages/auth/login', {
              emailValue: rawData.email || '',
              emailErrorMessage: errorMessages?.email || '',
              passwordValue: rawData.password || '',
              passwordErrorMessage: errorMessages?.password || '',
            })
          )
    }
  }
}