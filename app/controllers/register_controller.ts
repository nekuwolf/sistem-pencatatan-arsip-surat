import type { HttpContext } from '@adonisjs/core/http'
import { storeRegisterValidator } from '#validators/register_validator'
import RegisterInviteLink from '#models/register_invite_link'
import { dd } from '@adonisjs/core/services/dumper'
import User from '#models/user'
import Gender from '#models/gender'
import { DateTime } from 'luxon'
import { G_USER_ROLE } from '#start/globals'

export default class RegisterController {
    /**
    * Display form to create a new record
    */
    async create({ view, request, response, session }: HttpContext) {
      const registerCode = request.input('register_code')
      
      let showRegisterForm = false
      let isRegisterCodeValid = false
      let showNipField = false // Default to hidden
      let registerFormAlertMessage =''
      const gender = await Gender.all()
      const genderOptions = gender.map(g => ({value: g.id, label: g.name}))

      if (registerCode) {
        const inviteLink = await RegisterInviteLink.findValidRegisterCodeByCode(registerCode)

        if (inviteLink) {
          showRegisterForm = true
          isRegisterCodeValid = true

          // Check the Role ID directly from the invite link
          const roleId = inviteLink.newUserRoleId

          if (
            roleId === G_USER_ROLE.ADMIN.ID || 
            roleId === G_USER_ROLE.EMPLOYEE.ID
          ) {
            showNipField = true
          }

          registerFormAlertMessage = `You will be registered as ${inviteLink.newUserJobRole.name}, ${inviteLink.newUserDepartment.name}, ${inviteLink.newUserOrganization.name}`
        } else {
          session.flash('errors.register_code', 'Invalid or expired code')

          session.flashOnly(['register_code'])

          return response.redirect().toRoute('auth.register.create')
        }
      }

      return view.render('pages/auth/register', {
        showRegisterForm,
        isRegisterCodeValid,
        showNipField, // Pass this to the view
        register_code: registerCode || '',
        registerFormAlertMessage,
        genderOptions
        // ... other data
      })
    }

    /**
    * Handle form submission for the create action
    */
    async store({ request, view, response, auth, session }: HttpContext) {
      const registerCode = request.input('register_code')

      try {
        // 1. Validate
        const validated = await request.validateUsing(storeRegisterValidator)

        // 2. Register
        const registeredUser = await User.registerNewUserWithRegisterCode(validated)

        // 3. Login
        if (registeredUser) {
          await auth.use().login(registeredUser)
        }

        return response.redirect().toRoute('mails.index')

      } catch (error) {
        // If it's a validation error or your custom exception
        // Flash the inputs so the form stays filled
        session.flashAll()

        // Redirect back to the GET route WITH the register_code in the URL
        return response.redirect().toRoute('auth.register.create', {}, {
          qs: { register_code: registerCode }
        })
      }
    }
    
}