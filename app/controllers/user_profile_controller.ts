import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { dd } from '@adonisjs/core/services/dumper'
import { DateTime } from 'luxon'
import { populateForm } from '../helpers/populate_form.js'
import User from '#models/user'
import { dataModelFlattener } from '../helpers/data_model_flattener.js'
import Gender from '#models/gender'
import vine from '@vinejs/vine'
import { updateProfileValidator } from '#validators/profile_validator'

export default class UserProfileController {
  /**
   * Display own profile
   */
  async index({ view, request, auth }: HttpContext) {
    // 1. Get the query parameters
    const qs = request.qs()
    
    // 2. Determine if we are in "Edit Mode"
    // Checks if url is /profile?edit=true
    const isEditing = qs.edit === 'true'

    // 3. Get the authenticated user
    const user = auth.user!

    // 4. PRELOAD RELATIONSHIPS
    // Crucial: Your view uses user.gender.name, user.organization.name, etc.
    // These must be loaded manually, or they will be null/undefined.
    await user.load('gender')
    await user.load('organization')
    await user.load('department')
    await user.load('jobRole')
    await user.load('role')

    let gender, genderOptions;
    if (isEditing) {
      gender = await Gender.all()
      genderOptions = gender.map(g => ({value: g.id, label: g.name, isSelected: user.genderId === g.id}))
    }

    // 5. Render the main profile page and pass the flag
    return view.render('pages/account/profile', {
      isEditing: isEditing,
      genderOptions,
    })
  }

  /**
   * Handle the "Edit Profile" form submission
   */
  public async update({ auth, request, response, session }: HttpContext) {
    // 1. Get the currently logged-in user
    const user = auth.user!

    // 3. Validate the request data
    const payload = await request.validateUsing(updateProfileValidator)

    // 4. Update User Data
    user.fullName = payload.full_name
    
    // Convert JS Date (from Vine) to Luxon DateTime (for Adonis Model)
    user.birthDate = DateTime.fromJSDate(payload.birth_date)
    
    // Handle optional fields
    user.personalPhoneNumber = payload.personal_phone_number || ''
    user.birthPlace = payload.birth_place || ''
    user.fullHomeAddress = payload.full_home_address || ''

    // 5. Save to Database
    await user.save()

    // 6. Flash success message
    session.flash('profileFormAlertMessage', 'Profile updated successfully!')

    // 7. Redirect back to Profile Page (removing the ?edit=true query param)
    return response.redirect().toRoute('account.profile.index')
  }

  /**
   * Show record
   */
  public async show({ auth, request, response, session }: HttpContext) {
  
  }
  

  /**
   * Delete record
   */
  // async destroy({ params }: HttpContext) {}
}