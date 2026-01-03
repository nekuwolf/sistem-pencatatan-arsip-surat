import PersonTitleName from '#models/person_title_name'
import { apiSearchPersonTitleNameValidator } from '#validators/person_title_name_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { dd } from '@adonisjs/core/services/dumper'

export default class PersonTitleNameController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
  
  /**
   * search api
   */
  async searchApi({ params, request, response }: HttpContext) {
    let req;
    try {
      req = await request.validateUsing(apiSearchPersonTitleNameValidator)
    } catch (error) {
      if (error.code !== 'E_VALIDATION_ERROR') {
        throw error
      }
      
      return response.json({
        errorCode: error.code,
        errorMessage: error.message
      })
    }

    let personTitleNames;
    if (!req.q) {
      personTitleNames = await PersonTitleName.query().limit(10)
    }
    else {
      personTitleNames = await PersonTitleName.query().where('name', 'like', `%${req.q}%`).limit(30)
    }
    
    if (personTitleNames) {
      return response.json(
        personTitleNames.map((personTitleName: PersonTitleName) => ({
          value: personTitleName.id,
          label: `${personTitleName.name} (${personTitleName.title || ' - '})`
        })
      ))
    }
    else {
      return response.json({
        errorCode: 500,
        errorMessage: 'Internal server error'
      })
    }
  }
}