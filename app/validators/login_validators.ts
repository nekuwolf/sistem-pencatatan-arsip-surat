import { G_USER_ACCOUNT_PASSWORD_MIN_LENGTH } from '#start/globals'
import vine from '@vinejs/vine'

/** 
 * create login form validation
 */
export const createLoginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().optional(),
  })
)

/** 
 * store data from login form validation
 */
export const storeLoginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string().minLength(G_USER_ACCOUNT_PASSWORD_MIN_LENGTH).trim(),
  })
)