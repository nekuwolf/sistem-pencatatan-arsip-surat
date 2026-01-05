import { G_USER_ACCOUNT_PASSWORD_MIN_LENGTH } from '#start/globals'
import vine from '@vinejs/vine'

/** 
 * create login form validation
 */
export const updateProfileValidator = vine.compile(
  vine.object({
    full_name: vine.string().trim().minLength(3).maxLength(255),
    personal_phone_number: vine.string().mobile().optional(),
    birth_date: vine.date({ formats: ['YYYY-MM-DD'] }),
    birth_place: vine.string().trim().optional(),
    full_home_address: vine.string().trim().maxLength(500).optional(),
  })
)