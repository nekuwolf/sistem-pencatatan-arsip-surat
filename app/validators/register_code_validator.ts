import { G_REGISTER_CODE_LENGTH } from '#start/globals'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Modular validator for a single register code.
 * Can be reused across controllers.
 */
export const registerCodeSchema = vine.object({
  register_code: vine
    .string()
    .trim()
    .alphaNumeric()
    // Use fixedLength for strict enforcement of your global constant
    .fixedLength(G_REGISTER_CODE_LENGTH)
})

export const registerCodeValidator = vine.compile(registerCodeSchema)

registerCodeValidator.messagesProvider = new SimpleMessagesProvider({
  'register_code.required': 'Please enter the registration code.',
  'register_code.alphaNumeric': 'The registration code must only contain letters and numbers.',
  'register_code.fixedLength': `The registration code must be exactly ${G_REGISTER_CODE_LENGTH} characters long.`,
})