import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import RegisterInviteLink from './register_invite_link.js'
import Organization from './organization.js'
import ArchiveBox from './archive_box.js'
import ArchiveEnvelope from './archive_envelope.js'
import Mail from './mail.js'

export default class Department extends BaseModel {
  public static table = 'department'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organizationId: number
  
  @column()
  declare name: string

  @column()
  declare description: string | null

  // A department can only be assigned to an organization
  @belongsTo(() => Organization, { foreignKey: 'organizationId' })
  declare organization: BelongsTo<typeof Organization>

  // A department has many user
  @hasMany(() => User, { foreignKey: 'departmentId' })
  declare userData: HasMany<typeof User>
  
  // A department can be assigned to many register invite link
  @hasMany(() => RegisterInviteLink, { foreignKey: 'newUserDepartmentId' })
  declare registerInviteLink: HasMany<typeof RegisterInviteLink>

  // A department has many archive box
  @hasMany(() => ArchiveBox, { foreignKey: 'organizationId' })
  declare archiveBox : HasMany<typeof ArchiveBox>

  // A department has many archive box
  @hasMany(() => ArchiveEnvelope, { foreignKey: 'organizationId' })
  declare archiveEnvelope : HasMany<typeof ArchiveEnvelope>

  // A department has many mail
  @hasMany(() => Mail, { foreignKey: 'belongToDepartmentId' })
  declare createdMail: HasMany<typeof Mail>
}