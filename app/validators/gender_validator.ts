import vine from '@vinejs/vine'

export const apiSearchGenderValidator = vine.compile(
  vine.object({
    q: vine.string().trim(),
  })
)