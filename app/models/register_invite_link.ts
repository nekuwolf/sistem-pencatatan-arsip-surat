import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { G_REGISTER_CODE_EXPIRY_TIME_MINUTE, G_REGISTER_CODE_LENGTH } from '#start/globals'
import { generateRandomAlphanumeric } from '#utils/generate_random_string'
import Department from './department.js'
import { InvalidOrExpiredRegisterCodeException, RegisterCodeCreationFailedException } from '../helpers/custom_exceptions.js'
import UserRole from './users_role.js'
import UserJobRole from './users_job_role.js'
import Organization from './organization.js'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class RegisterInviteLink extends BaseModel {
  public static table = 'register_invite_link'
    
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare createdByUserId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime()
  declare expireAt: DateTime

  @column()
  declare key: string

  @column.dateTime()
  declare usedAt?: DateTime | null
  
  @column()
  declare createdUserId?: number | null
  
  @column()
  declare newUserDepartmentId: number
  
  @column()
  declare newUserRoleId: number
  
  @column()
  declare newUserJobRoleId: number
  
  @column()
  declare newUserOrganizationId: number

  @belongsTo(() => User, { foreignKey: 'createdByUserId' })
  declare createdByUser: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'createdUserId' })
  declare createdUser: BelongsTo<typeof User>
  
  @belongsTo(() => Department, { foreignKey: 'newUserDepartmentId' })
  declare newUserDepartment: BelongsTo<typeof Department>
  
  @belongsTo(() => UserRole, { foreignKey: 'newUserRoleId' })
  declare newUserRole: BelongsTo<typeof UserRole>
  
  @belongsTo(() => UserJobRole, { foreignKey: 'newUserJobRoleId' })
  declare newUserJobRole: BelongsTo<typeof UserJobRole>

  @belongsTo(() => Organization, { foreignKey: 'newUserOrganizationId' })
  declare newUserOrganization: BelongsTo<typeof Organization>

  // look for specified key that is active/unused
  public static async findValidRegisterCodeByCode(code: string, client?: TransactionClientContract,): Promise<RegisterInviteLink | null> {
    return this.query({ client: client })
      .where('key', code)
      .whereNull('used_at')
      .whereNull('created_user_id')
      .where('expire_at', '>', DateTime.utc().toSQL())
      .preload('newUserOrganization')
      .preload('newUserDepartment')
      .preload('newUserJobRole')
      .preload('newUserRole')
      .first()
  }

  public static async findOrFailValidRegisterCodeByCode(code: string, client?: TransactionClientContract,): Promise<RegisterInviteLink> {
    return this.query({ client: client })
      .where('key', code)
      .whereNull('used_at')
      .whereNull('created_user_id')
      .where('expire_at', '>', DateTime.utc().toSQL())
      .firstOrFail()
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
          createdByUserId: createdByUserId,
          key: generatedCode,
          newUserDepartmentId: newUserDepartmentId,
          newUserRoleId: newUserRoleId,
          newUserJobRoleId: newUserJobRoleId,
          newUserOrganizationId: newUserOrganizationId,
          expireAt: DateTime.utc().plus({ minutes: G_REGISTER_CODE_EXPIRY_TIME_MINUTE })
        }, { client: client })
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
    
    existingCode.usedAt = DateTime.utc()
    existingCode.createdUserId = createdUserId
    
    await existingCode.save()

    return existingCode
  }
  
}