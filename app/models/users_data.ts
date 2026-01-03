import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Gender from '#models/gender'
import Organization from '#models/organization'
import UsersRole from '#models/users_role'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import PersonTitleName from '#models/person_title_name'
import UserStatusTag from '#models/users_status_tags'
import UserJobRole from '#models/users_job_role'
import Department from '#models/department'
import UploadedFile from './uploaded_file.js'
import { InvalidEmailException, InvalidPasswordException } from '../helpers/custom_exceptions.js'

// this hooks into create/save and hashes password
const AuthFinder = withAuthFinder(() => hash.use(), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class UserData extends compose(BaseModel, AuthFinder) {
  public static table = 'users_datas'
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column()
  declare full_name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare personal_phone_number: string

  @column.date()
  declare birth_date: DateTime

  @column()
  declare birth_place: string

  @column()
  declare full_home_address: string

  @column()
  declare gender_id: number

  @column()
  declare role_id: number

  @column()
  declare organization_id: number
  
  @column()
  declare job_role_id: number
  
  @column()
  declare department_id: number

  // A user data can has one user_id
  @belongsTo(() => User, { foreignKey: 'user_id' })
  declare user: BelongsTo<typeof User>

  // A user data can has one gender
  @belongsTo(() => Gender, { foreignKey: 'gender_id' })
  declare gender: BelongsTo<typeof Gender>

  // A user data can has one user role
  @belongsTo(() => UsersRole, { foreignKey: 'role_id' })
  declare role: BelongsTo<typeof UsersRole>

  // A user data can has one organization
  @belongsTo(() => Organization, { foreignKey: 'organization_id' })
  declare organization: BelongsTo<typeof Organization>

  // A user data can has one job role
  @belongsTo(() => UserJobRole, { foreignKey: 'job_role_id' })
  declare job_role: BelongsTo<typeof UserJobRole>

  // A user data can has one department
  @belongsTo(() => Department, { foreignKey: 'department_id' })
  declare department: BelongsTo<typeof Department>

  // A user data (for full_name) can have many titles using pivot table users_datas_person_title_names
  @manyToMany(() => PersonTitleName, {
    localKey: 'id',
    pivotForeignKey: 'user_data_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'person_title_name_id',
    pivotTimestamps: false,
    pivotTable: 'users_datas_person_title_names'
  })
  declare person_title_name: ManyToMany<typeof PersonTitleName>

  // A user data can have many user statuses using pivot table users_datas_statuses
  @manyToMany(() => UserStatusTag, {
    localKey: 'id',
    pivotForeignKey: 'user_data_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_status_tag_id',
    pivotTimestamps: false,
    pivotTable: 'users_datas_statuses'
  })
  declare user_status_tag: ManyToMany<typeof UserStatusTag>

  // A user data can have many avatars using pivot table users_avatars
  @manyToMany(() => UploadedFile, {
    localKey: 'id',
    pivotForeignKey: 'user_data_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'uploaded_file_id',
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: false
    },
    pivotTable: 'users_datas_avatars',
  })
  declare user_avatar: ManyToMany<typeof UploadedFile>

  /**
   * passowrd are auto hashed
   */  
  public static async findByEmailPassword(email: string, password: string) {
    const record = await UserData.query()
      .where('email', email)
      .orderBy('created_at', 'desc')
      .preload('user')
      .first()

    if (!record) {
      throw new InvalidEmailException()
    }

    const isValid = await hash.verify(record.password, password)

    if (!isValid) {
      throw new InvalidPasswordException()
    }

    return record
  }
}
