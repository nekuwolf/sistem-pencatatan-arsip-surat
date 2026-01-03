import { G_REGISTER_CODE_LENGTH } from '#start/globals'
import vine from '@vinejs/vine'

/**
 * Modular validator for a single register code.
 * Can be reused across controllers.
 */
export const registerCodeSchema = vine.object({
  register_code: vine
    .string()
    .alphaNumeric()
    .minLength(G_REGISTER_CODE_LENGTH)
    .maxLength(G_REGISTER_CODE_LENGTH)
    .trim()
})

export const registerCodeValidator = vine.compile(registerCodeSchema)
