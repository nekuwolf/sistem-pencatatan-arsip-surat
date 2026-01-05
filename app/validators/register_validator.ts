import vine from '@vinejs/vine'
import { registerCodeSchema } from './register_code_validator.js'
import { G_USER_ACCOUNT_PASSWORD_MIN_LENGTH } from '#start/globals'

/**
 * Reuse the rule from the modular registerCode schema
 */
const registerCodeRule = registerCodeSchema.getProperties().register_code

// before insert data in db validation
export const storeRegisterValidator = vine.compile(
  vine.object({
    register_code: registerCodeRule,
    full_name: vine.string().trim(),
    email: vine.string().email().trim(),
    password: vine.string().minLength(G_USER_ACCOUNT_PASSWORD_MIN_LENGTH).trim(),
    password_confirmation: vine.string().minLength(G_USER_ACCOUNT_PASSWORD_MIN_LENGTH).sameAs('password').trim(),
    personal_phone_number: vine.string().mobile().trim(),
    birth_date: vine.date(),
    birth_place: vine.string().trim(),
    full_home_address: vine.string().trim(),
    gender_id: vine.number(),
    nip: vine.string().trim(),
  })
)

// show register form validation
export const createRegisterValidator = vine.compile(
  vine.object({
    register_code: registerCodeRule.optional(),
    email: vine.string().email().trim().optional()
  })
)

/** 
 * show verify_register_code form validation
 */
export const createVerifyRegisterCodeValidator = vine.compile(
  vine.object({
    register_code: registerCodeRule.optional(),
    email: vine.string().email().trim().optional()
  })
)

/** 
 * store data from verify_register_code form validation
 */
export const storeVerifyRegisterCodeValidator = vine.compile(
  vine.object({
    register_code: registerCodeRule,
  })
)