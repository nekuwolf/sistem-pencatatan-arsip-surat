import vine from '@vinejs/vine'
import { registerCodeSchema } from './register_code_validator.js'
import { G_USER_ACCOUNT_PASSWORD_MIN_LENGTH } from '#start/globals'

const registerCodeRule = registerCodeSchema.getProperties().register_code

export const storeRegisterValidator = vine.compile(
  vine.object({
    register_code: registerCodeRule,
    full_name: vine.string().trim(),
    email: vine.string().email().trim(),
    password: vine.string().minLength(G_USER_ACCOUNT_PASSWORD_MIN_LENGTH),
    
    // 1. Password confirmation usually doesn't need duplication of rules
    password_confirmation: vine.string().sameAs('password'),
    
    personal_phone_number: vine.string().mobile().trim(),
    birth_date: vine.date({ formats: ['YYYY-MM-DD'] }),
    birth_place: vine.string().trim(),
    full_home_address: vine.string().trim(),
    gender_id: vine.number(),

    // 2. Make NIP optional so it doesn't crash when the field is hidden
    nip: vine.string().trim().optional(), 
  })
)

export const createRegisterValidator = vine.compile(
  vine.object({
    register_code: registerCodeRule,
  })
)