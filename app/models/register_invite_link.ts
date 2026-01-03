import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { G_REGISTER_CODE_EXPIRY_TIME_MINUTE, G_REGISTER_CODE_LENGTH } from '#start/globals'
import { generateRandomAlphanumeric } from '#utils/generate_random_string'
import Department from './department.js'
import { InvalidOrExpiredRegisterCodeException, InvalidRegisterCodeException, RegisterCodeCreationFailedException } from '../helpers/custom_exceptions.js'
import UserRole from './users_role.js'
import UserJobRole from './users_job_role.js'
import Organization from './organization.js'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class RegisterInviteLink extends BaseModel {
  public static table = 'register_invite_links'
    
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare created_by_user_id: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime()
  declare expire_at: DateTime

  @column()
  declare key: string

  @column.dateTime()
  declare used_at?: DateTime | null
  
  @column()
  declare created_user_id?: number | null
  
  @column()
  declare new_user_department_id: number
  
  @column()
  declare new_user_role_id: number
  
  @column()
  declare new_user_job_role_id: number
  
  @column()
  declare new_user_organization_id: number

  @belongsTo(() => User, { foreignKey: 'created_by_user_id' })
  declare created_by_user: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'created_user_id' })
  declare created_user: BelongsTo<typeof User>
  
  @belongsTo(() => Department, { foreignKey: 'new_user_department_id' })
  declare new_user_department: BelongsTo<typeof Department>
  
  @belongsTo(() => UserRole, { foreignKey: 'new_user_role_id' })
  declare new_user_role: BelongsTo<typeof UserRole>
  
  @belongsTo(() => UserJobRole, { foreignKey: 'new_user_job_role_id' })
  declare new_user_job_role: BelongsTo<typeof UserJobRole>

  @belongsTo(() => Organization, { foreignKey: 'new_user_organization_id' })
  declare new_user_organization: BelongsTo<typeof Organization>

  // look for specified key that is active/unused
  public static async findValidRegisterCodeByCode(code: string, client?: TransactionClientContract,): Promise<RegisterInviteLink | null> {
    return this.query({ client: client })
      .where('key', code)
      .whereNull('used_at')
      .whereNull('created_user_id')
      .where('expire_at', '>', DateTime.utc().toSQL())
      .first()
  }
  
  public static async createNewRegisterCode(
    createdByUserId: number,
    newUserDepartmentId: number,
    newUserRoleId: number,
    newUserJobRoleId: number,
    newUserOrganizationId: number,
    client?: TransactionClientContract
  ): Promise<RegisterInviteLink> {
    const MAX_ATTEMPTS = 5
    for (let i = 1; i <= MAX_ATTEMPTS; i++) {
      const generatedCode = generateRandomAlphanumeric( G_REGISTER_CODE_LENGTH,
        G_REGISTER_CODE_LENGTH )
      const existingCode = await this.findValidRegisterCodeByCode(generatedCode)
  
      if (!existingCode) {
        return this.create({
          created_by_user_id: createdByUserId,
          key: generatedCode,
          new_user_department_id: newUserDepartmentId,
          new_user_role_id: newUserRoleId,
          new_user_job_role_id: newUserJobRoleId,
          new_user_organization_id: newUserOrganizationId,
          expire_at: DateTime.utc().plus({ minutes: G_REGISTER_CODE_EXPIRY_TIME_MINUTE })
        })
      }
    }
    
    throw new RegisterCodeCreationFailedException(`Failed to create a unique ${G_REGISTER_CODE_LENGTH}-digit invite link key after ${MAX_ATTEMPTS} attempts`)
  }

  // use register code
  public static async useRegisterCode(code: string, createdUserId: number, client?: TransactionClientContract): Promise<RegisterInviteLink> {
    const existingCode = await this.findValidRegisterCodeByCode(code, client)

    if (!existingCode) {
      throw new InvalidOrExpiredRegisterCodeException()
    }
    
    existingCode.used_at = DateTime.utc()
    existingCode.created_user_id = createdUserId
    
    await existingCode.save()

    return existingCode
  }
}