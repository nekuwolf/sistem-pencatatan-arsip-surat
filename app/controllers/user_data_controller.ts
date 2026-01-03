import User from '#models/user'
import UserData from '#models/users_data'
import { G_USER_ROLE } from '#start/globals'
import type { HttpContext } from '@adonisjs/core/http'
import { dd } from '@adonisjs/core/services/dumper'
import { url } from 'inspector'
import { mapUserWithUserData } from '../helpers/mapper/user_data_mapper.js'

export default class UserDataController {
  /**
   * Display a list of resource
   */
  async index({ view, request, response, auth }: HttpContext) {
    const responseAsJson = request.input('resAsJson') ? true : false
    const query = request.input('q')

    const currentUser = auth.getUserOrFail()

    if (currentUser.role_id === G_USER_ROLE.ADMIN.ID) {
      const users = mapUserWithUserData(await User.allPreloadUserData()) 

      // dd(users)

      return view.render('pages/dashboard/user/index', {
        users: users
      })

      // dd(mapUserWithUserData(users))

      // for (const user of users) {
      //   console.log(user.latest_user_data?.email)

      //   if (user.latest_user_data?.user_status_tag) {
      //     for (const user_status of user.latest_user_data.user_status_tag) {
      //       console.log(user_status.name)
      //     }
      //   }
      // }

      // const usersJson = users.map((user) => ({
      //   id: user.id,
      //   createdAt: user.created_at,
      //   latestUserData: user.latest_user_data
      //     ? {
      //         fullName: user.latest_user_data.full_name,
      //         email: user.latest_user_data.email,
      //         organization: user.latest_user_data.organization?.name,
      //         statusTags: user.latest_user_data.user_status_tag?.map(
      //           (tag) => tag.name
      //         ),
      //       }
      //     : null,
      // }))



    }
    // else {
      //   allUser = await User.selectAllByOrganizationIdPreloadUserData(currentUser.organization_id)
      // }
      

    return view.render('pages/dashboard/user/index', {
      columns: [
        { key: 'id', label: 'id', hidden: true },
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        { key: 'employement', label: 'Employement' },
        { key: 'created_at', label: 'Created At'},
        { key: 'status', label: 'Account Status' },
        { key: 'tags', label: 'Attributes' },
        { key: 'actions', label: 'Actions' },
      ],
      datas: [
        {
          id: { value: '1' },
          name: { value: 'Surat Undangan', mark: 'TITLE' },
          role: { value: 'Dr. Ir. I Gusti Ngurah Eddy Mulya, SE. M.S', mark: 'SUBTITLE' },
          employement: { value: 'Undangan Pementasan Inagurasi Kesenian dalam rangka Melepas Matahari Tahun 2025', mark: 'SUBSUBTITLE' },
          created_at: { value: '31/12/25 23:23:59 (23H 59M ago)', mark: 'DATETIME' },
          
          // Column 1: Single Badge
          status: { value: 'Active', mark: 'STATUSBADGE' }, 
          
          // Column 2: Multiple Badges
          tags: [
            { value: 'Read', mark: 'STATUSBADGE' },
            { value: 'Unread', mark: 'STATUSBADGE' },
            { value: 'Already Dispositioned', mark: 'STATUSBADGE' },
            { value: 'No Disposition', mark: 'STATUSBADGE' },
            { value: 'Archived', mark: 'STATUSBADGE' },
            { value: 'Not Archived', mark: 'STATUSBADGE' }
          ],

          // Column 3: actions
          actions: [
            { value: '#detail', mark: 'ACTIONVIEWDETAIL' },
            { value: '#', mark: 'ACTIONEDIT' },
            { value: '#', mark: 'ACTIONDELETE' },
          ]
        },
        {
          id: { value: '2' },
          name: { value: 'Jacob Thornton', mark: 'TITLE' },
          role: { value: 'SEO Specialist', mark: 'SUBTITLE' },
          created_at: { value: '1 December 2025 12:15:45', mark: 'DATETIME' },
          
          // Column 1: Single Badge
          status: { value: 'Pending', mark: 'STATUSBADGE' },
          
          // Column 2: Single Badge (wrapped in array or object is fine)
          tags: { value: 'Contractor', mark: 'STATUSBADGE' }
        },
        {
          id: { value: '1' },
          name: { value: 'Mark Otto', mark: 'TITLE' },
          role: { value: 'Frontend Dev', mark: 'SUBTITLE' },
          created_at: { value: '1 December 2025 12:15:45', mark: 'DATETIME' },
          
          // Column 1: Single Badge
          status: { value: 'Active', mark: 'STATUSBADGE' }, 
          
          // Column 2: Multiple Badges
          tags: [
            { value: 'Remote', mark: 'STATUSBADGE' },
            { value: 'Senior', mark: 'STATUSBADGE' },
            { value: 'Test Success', mark: 'STATUSBADGE' },
            { value: 'Test Warning', mark: 'STATUSBADGE' }
          ]
        },
        {
          id: { value: '1' },
          name: { value: 'Mark Otto', mark: 'TITLE' },
          role: { value: 'Frontend Dev', mark: 'SUBTITLE' },
          created_at: { value: '1 December 2025 12:15:45', mark: 'DATETIME' },
          
          // Column 1: Single Badge
          status: { value: 'Active', mark: 'STATUSBADGE' }, 
          
          // Column 2: Multiple Badges
          tags: [
            { value: 'Remote', mark: 'STATUSBADGE' },
            { value: 'Senior', mark: 'STATUSBADGE' },
            { value: 'Test Success', mark: 'STATUSBADGE' },
            { value: 'Test Warning', mark: 'STATUSBADGE' }
          ]
        },
        {
          id: { value: '1' },
          name: { value: 'Mark Otto', mark: 'TITLE' },
          role: { value: 'Frontend Dev', mark: 'SUBTITLE' },
          created_at: { value: '1 December 2025 12:15:45', mark: 'DATETIME' },
          
          // Column 1: Single Badge
          status: { value: 'Active', mark: 'STATUSBADGE' }, 
          
          // Column 2: Multiple Badges
          tags: [
            { value: 'Remote', mark: 'STATUSBADGE' },
            { value: 'Senior', mark: 'STATUSBADGE' },
            { value: 'Test Success', mark: 'STATUSBADGE' },
            { value: 'Test Warning', mark: 'STATUSBADGE' }
          ]
        },
        {
          id: { value: '1' },
          name: { value: 'Mark Otto', mark: 'TITLE' },
          role: { value: 'Frontend Dev', mark: 'SUBTITLE' },
          created_at: { value: '1 December 2025 12:15:45', mark: 'DATETIME' },
          
          // Column 1: Single Badge
          status: { value: 'Active', mark: 'STATUSBADGE' }, 
          
          // Column 2: Multiple Badges
          tags: [
            { value: 'Remote', mark: 'STATUSBADGE' },
            { value: 'Senior', mark: 'STATUSBADGE' },
            { value: 'Test Success', mark: 'STATUSBADGE' },
            { value: 'Test Warning', mark: 'STATUSBADGE' }
          ]
        },
        {
          id: { value: '1' },
          name: { value: 'Mark Otto', mark: 'TITLE' },
          role: { value: 'Frontend Dev', mark: 'SUBTITLE' },
          created_at: { value: '1 December 2025 12:15:45', mark: 'DATETIME' },
          
          // Column 1: Single Badge
          status: { value: 'Active', mark: 'STATUSBADGE' }, 
          
          // Column 2: Multiple Badges
          tags: [
            { value: 'Remote', mark: 'STATUSBADGE' },
            { value: 'Senior', mark: 'STATUSBADGE' },
            { value: 'Test Success', mark: 'STATUSBADGE' },
            { value: 'Test Warning', mark: 'STATUSBADGE' }
          ]
        },
        {
          id: { value: '1' },
          name: { value: 'Mark Otto', mark: 'TITLE' },
          role: { value: 'Frontend Dev', mark: 'SUBTITLE' },
          created_at: { value: '1 December 2025 12:15:45', mark: 'DATETIME' },
          
          // Column 1: Single Badge
          status: { value: 'Active', mark: 'STATUSBADGE' }, 
          
          // Column 2: Multiple Badges
          tags: [
            { value: 'Remote', mark: 'STATUSBADGE' },
            { value: 'Senior', mark: 'STATUSBADGE' },
            { value: 'Test Success', mark: 'STATUSBADGE' },
            { value: 'Test Warning', mark: 'STATUSBADGE' }
          ]
        },
      ]
    })
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
}