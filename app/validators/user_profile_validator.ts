import vine from '@vinejs/vine'
import { G_USER_ACCOUNT_PASSWORD_MIN_LENGTH } from '#start/globals'

// before insert data in db validation
export const showUserProfileValidator = vine.compile(
  vine.object({
    full_name: vine.string().trim(),
    email: vine.string().email().trim(),
    password: vine.string().minLength(G_USER_ACCOUNT_PASSWORD_MIN_LENGTH).trim(),
    personal_phone_number: vine.string().trim(),
    birth_date: vine.date(),
    birth_place: vine.string().trim(),
    full_home_address: vine.string().trim(),
    gender_id: vine.number(),
    organization_id: vine.number(),
    job_role_id: vine.number(),
    department_id: vine.number(),
    person_title_name_ids: vine.array(vine.number()),
  })
)
