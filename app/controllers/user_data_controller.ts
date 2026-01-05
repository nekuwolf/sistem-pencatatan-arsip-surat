import User from '#models/user'
import UserData from '#models/users_data'
import { G_USER_ROLE } from '#start/globals'
import type { HttpContext } from '@adonisjs/core/http'
import { dd } from '@adonisjs/core/services/dumper'
import { url } from 'inspector'
import { mapUsersDatasToDesktopTableMobileListEdgeView } from '../helpers/user_data_edge_mapper.js'

export default class UserDataController {
  /**
   * Display a list of resource
   */
  async index({ view, request, auth }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    
    // 1. Define variable for the Paginator object
    let paginatorResult;

    // 2. Fetch the Paginator based on role
    if (user.roleId === G_USER_ROLE.ADMIN.ID) {
      paginatorResult = await User.allUserInOrganizationIdPreloadEverythingPaginate(
        user.organizationId, 
        page
      )
    } 
    else if (user.roleId === G_USER_ROLE.EMPLOYEE.ID) {
      paginatorResult = await User.allUserInDepartmentIdInOrganizationIdPreloadEverythingPaginate(
        user.departmentId, 
        user.organizationId, 
        page
      )
    }

    // 3. IMPORTANT: Configure the base URL for the links
    if (paginatorResult) {
      paginatorResult.baseUrl(request.url())
    }

    // 4. Map the data using your existing function
    // We use .all() to get the User[] array from the Paginator
    const userTableDatas = paginatorResult 
      ? mapUsersDatasToDesktopTableMobileListEdgeView(paginatorResult.all()) 
      : null

    return view.render('pages/dashboard/user/index', {
      userTableDatas: userTableDatas, // Used for the Table/List
      paginator: paginatorResult      // Used for the Page Buttons
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    
  }

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
}