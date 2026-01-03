import { DateTime } from 'luxon'
import { BaseModel, column, computed, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import UserData from '#models/users_data'
import UploadedFile from '#models/uploaded_file'
import UserOtp from '#models/users_otp'
import UserSession from '#models/users_session'
import RegisterInviteLink from './register_invite_link.js'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { EmailAlreadyRegisteredException, InvalidEmailException, InvalidOrExpiredRegisterCodeException, InvalidPasswordException, InvalidRegisterCodeException } from '../helpers/custom_exceptions.js'
import { G_USER_STATUS_TAG } from '#start/globals'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class User extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  // A user can have many datas (trackable "profile")
  @hasMany(() => UserData, { foreignKey: 'user_id' })
  declare user_data: HasMany<typeof UserData>

  // A user can have many OTPs
  @hasMany(() => UserOtp, { foreignKey: 'created_by_user_id' })
  declare user_otp: HasMany<typeof UserOtp>

  // A user can have many sessions
  @hasMany(() => UserSession, { foreignKey: 'user_id' })
  declare user_session: HasMany<typeof UserSession>

  // A user can upload many files
  @hasMany(() => UploadedFile, { foreignKey: 'uploaded_by_user_id' })
  declare uploaded_file: HasMany<typeof UploadedFile>
  
  // A user can have many invite links
  @hasMany(() => RegisterInviteLink, { foreignKey: 'created_by_user_id' })
  declare created_invite_link: HasMany<typeof RegisterInviteLink>
  
  // An user can be attached to one invite link (register using invite link) 
  @hasOne(() => RegisterInviteLink, { foreignKey: 'created_user_id' })
  declare created_user_by_invite_link: HasOne<typeof RegisterInviteLink>

  public static async findByIdPreloadUserData(userId: number, client?: TransactionClientContract) {
    return await this.query({ client: client })
      .where('id', userId)
      .preload('user_data', (query) => {
        query.orderBy('created_at', 'desc')
        .preload('gender')
        .preload('role')
        .preload('organization')
        .preload('job_role')
        .preload('department')
        .preload('person_title_name')
        .preload('user_status_tag')
        .preload('user_avatar')
      })
      .firstOrFail()
  }

  public static async findOrFailByEmailPreloadUserData(email: string, client?: TransactionClientContract) {
    return await this.query({ client: client })
      .whereHas('user_data', (query) => {
        query.where('email', email)
      })
      .preload('user_data', (query) => {
        query.orderBy('created_at', 'desc')
        .preload('gender')
        .preload('role')
        .preload('organization')
        .preload('job_role')
        .preload('department')
        .preload('person_title_name')
        .preload('user_status_tag')
        .preload('user_avatar')
      })
      .firstOrFail()
  }

  public static async findByEmailPreloadUserData(email: string) {
    return await this.query()
      .whereHas('user_data', (query) => {
        query.where('email', email)
      })
      .preload('user_data', (query) => {
        query.orderBy('created_at', 'desc')
        .preload('gender')
        .preload('role')
        .preload('organization')
        .preload('job_role')
        .preload('department')
        .preload('person_title_name')
        .preload('user_status_tag')
        .preload('user_avatar')
      })
      .first()
  }
  
  public static async selectAllByOrganizationIdPreloadUserData(organizationId: number) {
    return await this.query()
      .whereHas('user_data', (query) => {
        query.where('organization_id', organizationId)
      })
      .preload('user_data', (query) => {
        query.orderBy('created_at', 'desc').first()
      })
  }

  @computed()
  get latest_user_data(): UserData | null {
    return this.user_data?.[0] ?? null
  }

  public static async allPreloadUserData() {
    return await this.query()
      .preload('user_data', (query) => {
        query.orderBy('created_at', 'desc')
        .preload('gender')
        .preload('role')
        .preload('organization')
        .preload('job_role')
        .preload('department')
        .preload('person_title_name')
        .preload('user_status_tag')
        .preload('user_avatar')
      })
  }

  /**
   * Register a new user using email and password, atomically
   */
  static async registerNewUserWithRegisterCode(
    registerCode: string,
    fullName: string,
    email: string,
    password: string,
    personalPhoneNumber: string,
    birthDate: DateTime,
    birthPlace: string,
    fullHomeAddress: string,
    genderId: number,
    personTitleNameIds: number[],
    // extraData: Partial<Omit<UserData, 'id' | 'user_id' | 'created_at' | 'password' | 'email'>> = {}
  ) {
    return db.transaction(async (trx) => {

      // 0. Check if email already exists (USE trx)
      const existingUserData = await UserData
        .query({ client: trx })
        .where('email', email)
        .orderBy('created_at', 'desc')
        .preload('user_status_tag', (query) => {
          query.where('user_status_tag_id', G_USER_STATUS_TAG.ACTIVE.ID)
        })
        .first()

      if (existingUserData) {
        throw new EmailAlreadyRegisteredException()
      }

      // 00. Check register code validity (MUST accept trx)
      const validRegisterCode =
        await RegisterInviteLink.findValidRegisterCodeByCode(registerCode, trx)

      if (!validRegisterCode) {
        throw new InvalidOrExpiredRegisterCodeException()
      }

      // 1. Create user (USE trx)
      const user = await this.create({}, { client: trx })

      // 2. Create user data (USE trx)
      const userData = await UserData.create({
        user_id: user.id,
        full_name: fullName,
        email,
        password,
        personal_phone_number: personalPhoneNumber,
        birth_date: birthDate,
        birth_place: birthPlace,
        full_home_address: fullHomeAddress,
        gender_id: genderId,
        role_id: validRegisterCode.new_user_role_id,
        organization_id: validRegisterCode.new_user_organization_id,
        job_role_id: validRegisterCode.new_user_job_role_id,
        department_id: validRegisterCode.new_user_department_id,
        // ...extraData,
      }, { client: trx })

      // 3. Attach relations (trx already bound)
      await userData.useTransaction(trx).related('person_title_name').attach(personTitleNameIds ?? [])
      await userData.useTransaction(trx).related('user_status_tag').attach([G_USER_STATUS_TAG.ACTIVE.ID])

      // 4. Use the register code
      await RegisterInviteLink.useRegisterCode(
        registerCode,
        user.id,
        trx
      )

      // 5. Final user created user
      const userFinal = await this.findByIdPreloadUserData(user.id, trx)

      return userFinal
    })
  }


  

}