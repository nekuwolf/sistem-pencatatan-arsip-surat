import { G_USER_ACCOUNT_PASSWORD_MIN_LENGTH } from '#start/globals'
import vine from '@vinejs/vine'

/**
 * Validation schema for updating user profile.
 * Excludes: Department, Organization, JobRole, and Role.
 */
export const updateUserProfileValidator = vine.compile(
  vine.object({
    full_name: vine.string().trim().minLength(3).maxLength(255).optional(),
    personal_phone_number: vine.string()
      .minLength(5) // Optional: basic length check
      .unique(async (db, value, field) => {
        const user = await db
          .from('user')
          .where('personal_phone_number', value)
          .whereNot('id', field.meta.userId) // Ignore the current user!
          .first()
        return !user
    }),
    
    // HTML5 date inputs usually send YYYY-MM-DD
    birth_date: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    
    birth_place: vine.string().trim().optional(),
    full_home_address: vine.string().trim().maxLength(500).optional(),
    
    // Ensure the selected gender exists in the database
    gender_id: vine.number().exists(async (db, value) => {
      const gender = await db.from('gender').where('id', value).first()
      return !!gender
    }).optional(),

    password: vine.string().minLength(G_USER_ACCOUNT_PASSWORD_MIN_LENGTH).trim().optional(),
    password_confirmation: vine.string().minLength(G_USER_ACCOUNT_PASSWORD_MIN_LENGTH).sameAs('password').trim().optional(),

    // Avatar validation integrated into Vine
    avatar: vine.file({
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    }).optional(),
  })
)