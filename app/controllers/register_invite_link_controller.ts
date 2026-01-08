import type { HttpContext } from '@adonisjs/core/http'
// import db from '@adonisjs/lucid/services/db'
import RegisterInviteLink from '#models/register_invite_link'
// import Department from '#models/department'
import UserRole from '#models/users_role'
import UserJobRole from '#models/users_job_role'
// import Organization from '#models/organization'
import vine from '@vinejs/vine'
import { mapRegisterInviteLinksToEdgeView } from '../helpers/register_invite_link_data_edge_mapper.js'

export default class RegisterInviteLinkController {
  /**
   * Display a list of resource
   */
  public async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const searchQ = request.input('search_q', '')
    const limit = 10

    const query = RegisterInviteLink.query()
      .preload('newUserOrganization')
      .preload('newUserDepartment')
      .preload('newUserRole')
      .preload('newUserJobRole')
      .preload('createdByUser')
      .orderBy('createdAt', 'desc')

    if (searchQ) {
      query.where('key', 'like', `%${searchQ}%`)
    }

    const inviteLinks = await query.paginate(page, limit)

    // This tells the paginator to use the current path (e.g., "/register_invite_link") 
    // instead of "/" when generating links.
    inviteLinks.baseUrl(request.url()) 

    const registerInvteLinkTableDatas = mapRegisterInviteLinksToEdgeView(inviteLinks.all())

    return view.render('pages/register_invite_link/index', {
      inviteLinks,
      registerInvteLinkTableDatas
    })
  }

  /**
   * Show the form for creating a new resource
   */
  public async create({ view }: HttpContext) {
    const options = await this.getFormOptions()
    return view.render('pages/register_invite_link/create', options)
  }

  /**
   * Handle the form submission to create a new resource
   */
  public async store({ request, response, auth, session }: HttpContext) {
    const schema = vine.object({
      // new_user_organization_id: vine.number().positive(),
      // new_user_department_id: vine.number().positive(),
      new_user_role_id: vine.number().positive(),
      new_user_job_role_id: vine.number().positive(),
    })

    const payload = await vine.validate({ schema, data: request.all() })
    const currentUser = auth.user!

    try {
      // Use the static method defined in your Model to handle generation loop
      await RegisterInviteLink.createNewRegisterCode(
        currentUser.id,
        // payload.new_user_department_id,
        currentUser.departmentId,
        payload.new_user_role_id,
        payload.new_user_job_role_id,
        // payload.new_user_organization_id
        currentUser.organizationId
      )

      session.flash('success', 'Link undangan berhasil dibuat.')
      return response.redirect().toRoute('registerInviteLinks.index')
    } catch (error) {
      session.flash('error', 'Gagal membuat link undangan. Silakan coba lagi.')
      return response.redirect().back()
    }
  }

  /**
   * Show details of a specific resource
   */
  public async show({ view, params, response, session }: HttpContext) {
    try {
      const inviteLink = await RegisterInviteLink.query()
        .where('id', params.id)
        .preload('newUserOrganization')
        .preload('newUserDepartment')
        .preload('newUserRole')
        .preload('newUserJobRole')
        .preload('createdByUser')
        .preload('createdUser') // User who used the code
        .firstOrFail()

      return view.render('pages/register_invite_link/show', { inviteLink })
    } catch (error) {
      session.flash('error', 'Data tidak ditemukan.')
      return response.redirect().toRoute('registerInviteLinks.index')
    }
  }

  /**
   * Show the form for editing the resource.
   */
  public async edit({ view, params, response, session }: HttpContext) {
    try {
      const inviteLink = await RegisterInviteLink.findOrFail(params.id)

      // Business Logic: Cannot edit if already used
      if (inviteLink.usedAt) {
        session.flash('error', 'Link yang sudah digunakan tidak dapat diedit.')
        return response.redirect().toRoute('registerInviteLinks.show', { id: params.id })
      }

      const options = await this.getFormOptions(
        inviteLink.newUserRoleId, 
        inviteLink.newUserJobRoleId
      )

      return view.render('pages/register_invite_link/edit', {
        inviteLink,
        ...options,
      })
    } catch (error) {
      session.flash('error', 'Data tidak ditemukan.')
      return response.redirect().toRoute('registerInviteLinks.index')
    }
  }

  /**
   * Handle the form submission to update the resource
   */
  public async update({ request, response, params, session }: HttpContext) {
    const inviteLink = await RegisterInviteLink.findOrFail(params.id)

    // Business Logic: Cannot update if already used
    if (inviteLink.usedAt) {
      session.flash('error', 'Link yang sudah digunakan tidak dapat diubah.')
      return response.redirect().toRoute('registerInviteLinks.show', { id: params.id })
    }

    const schema = vine.object({
      // new_user_organization_id: vine.number().positive(),
      // new_user_department_id: vine.number().positive(),
      new_user_role_id: vine.number().positive(),
      new_user_job_role_id: vine.number().positive(),
    })

    const payload = await vine.validate({ schema, data: request.all() })

    // Update fields
    // inviteLink.newUserOrganizationId = payload.new_user_organization_id
    // inviteLink.newUserDepartmentId = payload.new_user_department_id
    inviteLink.newUserRoleId = payload.new_user_role_id
    inviteLink.newUserJobRoleId = payload.new_user_job_role_id

    await inviteLink.save()

    session.flash('success', 'Konfigurasi link undangan berhasil diperbarui.')
    return response.redirect().toRoute('registerInviteLinks.show', { id: inviteLink.id })
  }

  /**
   * Private Helper to fetch dropdown options
   * Returns object formatted for Select Component options: { label: string, value: string/number }[]
   */
  // 1. Add optional parameters to receive the IDs you want to select
  private async getFormOptions(selectedRoleId?: number, selectedJobRoleId?: number) {
    const [roles, jobRoles] = await Promise.all([
      // Department.all(),
      UserRole.all(),
      UserJobRole.all(),
      // Organization.all(),
    ])

    return {
      // departmentOptions: departments.map((d) => ({ label: d.name, value: d.id })),
      // 2. Compare the current row's ID with the passed selectedRoleId
      roleOptions: roles.map((r) => ({ 
        label: r.name, 
        value: r.id, 
        isSelected: r.id === selectedRoleId 
      })),
      jobRoleOptions: jobRoles.map((j) => ({ 
        label: j.name, 
        value: j.id,
        isSelected: j.id === selectedJobRoleId
      })),
      
      // organizationOptions: organizations.map((o) => ({ label: o.name, value: o.id })),
    }
  }
}