import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { dd } from '@adonisjs/core/services/dumper'
import { DateTime } from 'luxon'

export default class UserProfileController {
  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    const userData = {
      id: 1,
      fullName: 'Alexander Pierce',
      email: 'alex.pierce@example.com',
      personalPhoneNumber: '12345678900',
      // Luxon DateTime object for the date field
      birthDate: DateTime.local(1992, 8, 15), 
      birthPlace: 'Seattle, Washington, USA',
      fullHomeAddress: '456 Innovation Dr, Tech City, CA 90210',
      genderId: 1,
      organizationId: 2,
      departmentId: 3,
      jobRoleId: 2,
      // Relationships
      role: { name: 'Senior Administrator' },
      userAvatar: {
        url: '/public/images/valve_source_engine_missing_content_512_512.png'
      }, // Random avatar
      userStatusTags: [
        { id: 1, name: 'Active' },
        { id: 2, name: 'Verified' }
      ]
    }

    const genders = [
      { value: 1, label: 'Male' },
      { value: 2, label: 'Female', isSelected: true },
      { value: 3, label: 'Non-binary' },
      { value: 4, label: 'Prefer not to say' }
    ]

    const organizations = [
      { value: 1, label: 'Nexus Solutions' },
      { value: 2, label: 'Global Tech Industries' },
      { value: 3, label: 'Creative Design Co.' }
    ]

    const departments = [
      { value: 1, label: 'Executive' },
      { value: 2, label: 'Human Resources' },
      { value: 3, label: 'Software Engineering' },
      { value: 4, label: 'Sales & Marketing' }
    ]

    const jobRoles = [
      { value: 1, label: 'Software Engineer' },
      { value: 2, label: 'Senior Backend Developer' },
      { value: 3, label: 'Product Owner' },
      { value: 4, label: 'HR Specialist' }
    ]
    // --- MOCK DATA END ---

    return view.render('pages/account/profile', {
      userData,
      genders,
      organizations,
      departments,
      jobRoles
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    console.log(request.all())
    return response.ok({})
  }

  /**
   * Show individual record
   */
  async show({ params, request, response }: HttpContext) {
    // dd(app.makePath('storage/testing/valve_source_engine_missing_content_512_512.png'))
    return response.download(app.makePath('storage/testing/valve_source_engine_missing_content_512_512.png'))

  }

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