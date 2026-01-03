import Gender from '#models/gender'
import { apiSearchGenderValidator } from '#validators/gender_validator';
import type { HttpContext } from '@adonisjs/core/http'
import { dd } from '@adonisjs/core/services/dumper'

export default class GenderController {
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
   * Delete record
   */
  async searchApi({ params, request, response }: HttpContext) {
    let req;
    try {
      req = await request.validateUsing(apiSearchGenderValidator)
    } catch (error) {
      if (error.code !== 'E_VALIDATION_ERROR') {
        throw error
      }
      
      return response.json({
        errorCode: error.code,
        errorMessage: error.message
      })
    }

    let genders;
    if (!req.q) {
      genders = await Gender.query().limit(10)
    }
    else {
      genders = await Gender.query().where('name', 'like', `%${req.q}%`).limit(30)
    }
    
    if (genders) {
      return response.json(
        genders.map((gender: Gender) => ({
          value: gender.name,
          label: gender.name
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