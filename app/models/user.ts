import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import UploadedFile from '#models/uploaded_file'
import RegisterInviteLink from './register_invite_link.js'
import db from '@adonisjs/lucid/services/db'
import { G_USER_ROLE, G_USER_STATUS_TAG } from '#start/globals'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { dd } from '@adonisjs/core/services/dumper'
import Gender from './gender.js'
import UsersRole from '#models/users_role'
import Organization from './organization.js'
import UserJobRole from './users_job_role.js'
import Department from './department.js'
import UserStatusTag from './users_status_tags.js'
import Mail from './mail.js'
import { Infer } from '@vinejs/vine/types'
import { storeRegisterValidator } from '#validators/register_validator'
import RegisterFailedException from '#exceptions/register_failed_exception'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'

// this hooks into create/save and hashes password
const AuthFinder = withAuthFinder(() => hash.use(), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  public static table = 'user'

  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare updatedAt: DateTime

  @column()
  declare nip: string

  @column()
  declare fullName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare personalPhoneNumber: string

  @column.date()
  declare birthDate: DateTime

  @column()
  declare birthPlace: string

  @column()
  declare fullHomeAddress: string

  @column()
  declare genderId: number
  
  @column()
  declare organizationId: number

  @column()
  declare departmentId: number
  
  @column()
  declare jobRoleId: number
  
  @column()
  declare roleId: number
  
  @column()
  declare profilePictureFileId: number | null

  // A user data can has one gender
  @belongsTo(() => Gender, { foreignKey: 'genderId' })
  declare gender: BelongsTo<typeof Gender>

  // A user data can has one user role
  @belongsTo(() => UsersRole, { foreignKey: 'roleId' })
  declare role: BelongsTo<typeof UsersRole>

  // A user data can has one organization
  @belongsTo(() => Organization, { foreignKey: 'organizationId' })
  declare organization: BelongsTo<typeof Organization>

  // A user data can has one job role
  @belongsTo(() => UserJobRole, { foreignKey: 'jobRoleId' })
  declare jobRole: BelongsTo<typeof UserJobRole>

  // A user data can has one department
  @belongsTo(() => Department, { foreignKey: 'departmentId' })
  declare department: BelongsTo<typeof Department>

  // A user can upload many files
  @hasMany(() => UploadedFile, { foreignKey: 'uploadedByUserId' })
  declare uploadedFile: HasMany<typeof UploadedFile>
  
  // A user can have many invite links
  @hasMany(() => RegisterInviteLink, { foreignKey: 'createdByUserId' })
  declare createdInviteLink: HasMany<typeof RegisterInviteLink>
  
  // An user can be attached to one invite link (register using invite link) 
  @hasOne(() => RegisterInviteLink, { foreignKey: 'createdUserId' })
  declare inviteLinkIdUsed: HasOne<typeof RegisterInviteLink>
  
  @hasMany(() => Mail, { foreignKey: 'createdByUserId' })
  declare createdMail: HasMany<typeof Mail>

  // A user data can have many user statuses using pivot table users_datas_statuses
  @manyToMany(() => UserStatusTag, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_status_tag_id',
    pivotTimestamps: false,
    pivotTable: 'user_status'
  })
  declare userStatusTag: ManyToMany<typeof UserStatusTag>

  @belongsTo(() => UploadedFile, { foreignKey: 'profilePictureFileId' })
  declare profilePictureFile: BelongsTo<typeof UploadedFile>

  get isAdmin() {
    return this.roleId === G_USER_ROLE.ADMIN.ID
  }

  /**
   * Returns true if the user is a standard Employee
   */
  get isEmployee() {
    return this.roleId === G_USER_ROLE.EMPLOYEE.ID
  }

  /**
   * Returns true if the user has restricted access
   */
  get isNotEmployee() {
    return this.roleId === G_USER_ROLE.NOT_EMPLOYEE.ID
  }

  /**
   * Helper to check if user belongs to "Staff" (Admin or Employee)
   */
  // get isStaff() {
  //   return [G_USER_ROLE.ADMIN.ID, G_USER_ROLE.EMPLOYEE.ID].includes(this.roleId)
  // }

  public static async allUserInOrganizationIdPreloadEverythingPaginate(organizationId: number, currentPage: number, itemPerPage?: number, client?: TransactionClientContract) {
    return await this.query({ client: client })
      .where('organization_id', organizationId)  
      .preload('gender')
      .preload('organization')
      .preload('department')
      .preload('jobRole')
      .preload('role')
      .preload('userStatusTag')
      .preload('profilePictureFile')
      .preload('inviteLinkIdUsed')
      .preload('createdMail')
      .preload('uploadedFile')
      .preload('createdInviteLink')
      .paginate(currentPage, itemPerPage || 10)
  }
    
  public static async allUserInDepartmentIdInOrganizationIdPreloadEverythingPaginate(departmentId: number, organizationId: number, currentPage: number, itemPerPage?: number, client?: TransactionClientContract) {
    return await this.query({ client: client })
      .where('organization_id', organizationId)  
      .andWhere('department_id', departmentId)  
      .preload('gender')
      .preload('organization')
      .preload('department')
      .preload('jobRole')
      .preload('role')
      .preload('userStatusTag')
      .preload('profilePictureFile')
      .preload('inviteLinkIdUsed')
      .preload('createdMail')
      .preload('uploadedFile')
      .preload('createdInviteLink')
      .paginate(currentPage, itemPerPage || 10)
  }  

  public static async allPreloadEverythingPaginate(currentPage: number, itemPerPage?: number, client?: TransactionClientContract) {
    return await this.query({ client: client })
      .preload('gender')
      .preload('organization')
      .preload('department')
      .preload('jobRole')
      .preload('role')
      .preload('userStatusTag')
      .preload('profilePictureFile')
      .preload('inviteLinkIdUsed')
      .preload('createdMail')
      .preload('uploadedFile')
      .preload('createdInviteLink')
      .paginate(currentPage, itemPerPage || 10)
  }

  public static async findByKeyValueWithLimitPreloadEverything(key: string, value: string, limit?: number, client?: TransactionClientContract) {
    return await this.query({ client: client })
      .where(key, value)
      .preload('gender')
      .preload('organization')
      .preload('department')
      .preload('jobRole')
      .preload('role')
      .preload('userStatusTag')
      .preload('profilePictureFile')
      .preload('inviteLinkIdUsed')
      .preload('createdMail')
      .preload('uploadedFile')
      .preload('createdInviteLink')
      .limit(limit || 1)
  }
  
  public static async findByKeyValueWithLimitloadEssential(key: string, value: string, limit?: number, client?: TransactionClientContract) {
    return await this.query({ client: client })
      .where(key, value)
      .preload('gender')
      .preload('organization')
      .preload('department')
      .preload('jobRole')
      .preload('role')
      .preload('userStatusTag')
      .preload('profilePictureFile')
      .limit(limit || 1)
  }

  /**
   * Register a new user using email and password, atomically
   */
  static async registerNewUserWithRegisterCode(payload: Infer<typeof storeRegisterValidator>) {
    return db.transaction(async (trx) => {
      
      // 1. Check for duplicates
      const existingUser = await User
        .query({ client: trx })
        .where('email', payload.email)
        .orWhere('personalPhoneNumber', payload.personal_phone_number)
        .whereHas('userStatusTag', (query) => {
          query.where('user_status_tag_id', G_USER_STATUS_TAG.ACTIVE.ID)
        })
        .first()
      
      const errors: Record<string, string> = {}
      let hasError = false

      if (existingUser?.email === payload.email) {
        errors.email = 'This email is already registered'
        hasError = true
      }

      if (existingUser?.personalPhoneNumber === payload.personal_phone_number) {
        errors.personalPhoneNumber = 'This phone number is already registered'
        hasError = true
      }

      // 2. Check register code
      const validRegisterCode = await RegisterInviteLink.findValidRegisterCodeByCode(
        payload.register_code, 
        trx
      )

      if (!validRegisterCode?.key) {
        errors.register_code = 'Invalid or expired register code'
        hasError = true
      }

      // 3. Throw Exception if errors exist
      if (hasError) {
        throw new RegisterFailedException(errors)
      }

      // 4. Create User (Convert JS Date -> Luxon DateTime here)
      const user = await User.create({
        fullName: payload.full_name,
        email: payload.email,
        password: payload.password,
        personalPhoneNumber: payload.personal_phone_number,
        birthDate: DateTime.fromJSDate(payload.birth_date), 
        birthPlace: payload.birth_place,
        fullHomeAddress: payload.full_home_address,
        genderId: payload.gender_id,
        roleId: validRegisterCode!.newUserRoleId,
        organizationId: validRegisterCode!.newUserOrganizationId,
        jobRoleId: validRegisterCode!.newUserJobRoleId,
        departmentId: validRegisterCode!.newUserDepartmentId,
      }, { client: trx })

      // 5. Attach Status
      await user.useTransaction(trx).related('userStatusTag').attach([G_USER_STATUS_TAG.ACTIVE.ID])

      // 6. Use the code
      await RegisterInviteLink.useRegisterCode(
        payload.register_code,
        user.id,
        trx
      )

      return await User.find(user.id, { client: trx })
    })
  }


}