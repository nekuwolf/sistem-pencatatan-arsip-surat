import type { HttpContext } from '@adonisjs/core/http'
import { createRegisterValidator, storeRegisterValidator } from '#validators/register_validator'
import RegisterInviteLink from '#models/register_invite_link'
import User from '#models/user'
import Gender from '#models/gender'
import { SimpleErrorReporter } from '@vinejs/vine'
import { errors as vineErrors } from '@vinejs/vine'
import { G_USER_ROLE } from '#start/globals'

export default class RegisterController {
  
  /**
   * Step 1 & 2: Show Register Forms
   * If 'register_code' is in QS, show full form. Otherwise show code input.
   */
  async create({ view, request, response, session }: HttpContext) {
    const registerCode = request.input('register_code')

    // 1. If we have a code, validate it and prepare the custom view data
    if (registerCode) {
      // Find code and preload the role to get the name (e.g. "Admin", "Employee")
      const inviteLink = await RegisterInviteLink.findValidRegisterCodeByCode(registerCode)

      // Validate code validity (active and not expired)
      if (!inviteLink) {
        session.flash('formAlertMessage', 'The register code is invalid or has expired.')
        return response.redirect().toRoute('auth.register.create')
      }

      // 2. Logic: Show NIP only for Admin or Employee
      const showNipField = [
        G_USER_ROLE.ADMIN.ID, 
        G_USER_ROLE.EMPLOYEE.ID
      ].includes(inviteLink.newUserRoleId as 1 | 2)

      // 3. Logic: Set the Alert Message based on the role name
      // e.g., "You are registering as a Admin"
      const formAlertMessage = `Anda akan mendaftar sebagai ${inviteLink.newUserJobRole.name}, ${inviteLink.newUserDepartment.name}, ${inviteLink.newUserOrganization.name}`

      // Fetch options for the form
      const genderOptions = await Gender.all()

      // Render the view with the flags
      return view.render('pages/auth/register', {
        register_code: registerCode,
        genderOptions: genderOptions.map((g) => ({ label: g.name, value: g.id })),
        
        // Pass the computed flags here
        showNipField: showNipField,
        formAlertMessage: formAlertMessage, 
      })
    }

    // Default: Show the Code Entry view
    return view.render('pages/auth/register_code')
  }

  /**
   * Action: Verify Code
   * Validates code from Step 1 and redirects to Step 2
   */
  async verify({ request, response, session }: HttpContext) {
    // 1. Validate format
    const payload = await request.validateUsing(createRegisterValidator)

    // 2. Check DB for validity
    const inviteLink = await RegisterInviteLink.findValidRegisterCodeByCode(payload.register_code)

    if (!inviteLink) {
      session.flash('errors.register_code', 'Invalid or expired register code')
      return response.redirect().back()
    }

    // 3. Valid: Redirect to 'create' WITH the code in Query String to trigger Step 2
    return response.redirect().toRoute('auth.register.create', {}, {
      qs: { register_code: payload.register_code }
    })
  }

  /**
   * Action: Create User
   * Finalize registration
   */
  async store({ request, response, auth, session }: HttpContext) {
    const registerCode = request.input('register_code')

    try {
      // 1. Validate all fields (including logic that the code must exist)
      // We manually report errors so we can catch them and redirect with QS
      const validated = await request.validateUsing(storeRegisterValidator)

      // 2. Create the user using your Model logic
      const registeredUser = await User.registerNewUserWithRegisterCode(validated)

      // 3. Login and Redirect
      if (registeredUser) {
        await auth.use('web').login(registeredUser)
      }
      
      session.flash('formAlertMessage', 'Account created successfully!')
      return response.redirect().toRoute('mails.index') // or dashboard

    } catch (error) {
      // 4. Handle Validation Errors manually to preserve Query String
      if (error instanceof vineErrors.E_VALIDATION_ERROR) {
        session.flashValidationErrors(error)
        
        // Redirect back to the FORM (Step 2) by including the register_code
        return response.redirect().toRoute('auth.register.create', {}, {
          qs: { register_code: registerCode }
        })
      }

      // 5. Handle Logic Errors (e.g. "Email already exists" from User model)
      session.flash('formAlertMessage', error.message || 'Registration failed')
      return response.redirect().toRoute('auth.register.create', {}, {
        qs: { register_code: registerCode }
      })
    }
  }
}