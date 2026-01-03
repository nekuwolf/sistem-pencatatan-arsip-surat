import vine from '@vinejs/vine'

export const apiSearchPersonTitleNameValidator = vine.compile(
  vine.object({
    q: vine.string().trim(),
  })
)