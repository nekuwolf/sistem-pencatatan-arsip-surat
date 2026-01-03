import vine from '@vinejs/vine'

export const passwordSchema = vine.object({
  password: vine
    .string()
    .trim()
})

export const passwordValidator = vine.compile(passwordSchema)
