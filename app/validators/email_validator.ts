import vine from '@vinejs/vine'

export const emailSchema = vine.object({
  email: vine
    .string()
    .email()
    .trim()
})

export const emailValidator = vine.compile(emailSchema)
