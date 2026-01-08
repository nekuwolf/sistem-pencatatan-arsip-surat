// import { G_USER_ROLE } from '#start/globals'
// import type { HttpContext } from '@adonisjs/core/http'

// export default class SandboxesController {
//   /**
//    * Display a list of resource
//    */
//   async index({ view, request }: HttpContext) {
//     return view.render('pages/dashboard', {
//       helloWorld: 'Hello World!',
//       userRole: G_USER_ROLE.EMPLOYEE
//     })
//   }

//   /**
//    * Display form to create a new record
//    */
//   async create({}: HttpContext) {}

//   /**
//    * Handle form submission for the create action
//    */
//   async store({ request }: HttpContext) {}

//   /**
//    * Show individual record
//    */
//   async show({ params }: HttpContext) {}

//   /**
//    * Edit individual record
//    */
//   async edit({ params }: HttpContext) {}

//   /**
//    * Handle form submission for the edit action
//    */
//   async update({ params, request }: HttpContext) {}

//   /**
//    * Delete record
//    */
//   async destroy({ params }: HttpContext) {}
// }