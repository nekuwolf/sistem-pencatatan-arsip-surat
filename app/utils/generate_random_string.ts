type RandomStringOptions = {
  charPool?: string
  minLength?: number
  maxLength?: number
} & (
  | { minLength: number; maxLength: number }
  | { minLength?: number; maxLength?: number }
)

export const CHAR_SETS = {
  base62: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  base36: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  numeric: '0123456789',
  hex: 'abcdef0123456789',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  symbols: '!@#$%^&*()_+-=[]{}<>?/|~',
}

export function generateRandomString(options: RandomStringOptions = {}): string {
  const {
    charPool = CHAR_SETS.base62,
    minLength = 16,
    maxLength = 16,
  } = options

  if (minLength > maxLength) {
    throw new Error(`minLength (${minLength}) cannot be greater than maxLength (${maxLength})`)
  }

  const length =
    minLength === maxLength
      ? minLength
      : Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength

  const poolLength = charPool.length
  const result = new Array<string>(length)

  const randomValues = new Uint32Array(length)
  crypto.getRandomValues(randomValues)

  for (let i = 0; i < length; i++) {
    result[i] = charPool[randomValues[i] % poolLength]
  }

  return result.join('')
}

// export const randomHex = (len = 32) =>
//   generateRandomString({ charPool: CHAR_SETS.hex, minLength: len })

export const generateRandomNumeric6 = () =>
  generateRandomString({ charPool: CHAR_SETS.numeric, minLength: 6, maxLength: 6 })

// export const randomPassword = (len = 8) =>
//   generateRandomString({
//     charPool: CHAR_SETS.uppercase + CHAR_SETS.lowercase + CHAR_SETS.numeric + CHAR_SETS.symbols,
//     minLength: len,
// })

export const generateRandomAlphanumeric6 = () => 
  generateRandomString({ charPool: CHAR_SETS.base62, minLength: 6, maxLength: 6 })

export const generateRandomAlphanumeric = (minLength: number, maxLength: number) => 
  generateRandomString({ charPool: CHAR_SETS.base62, minLength: minLength, maxLength: maxLength })
