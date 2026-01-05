export type RehydratedForm<T> = {
  values: Partial<Record<keyof T, any>>
  errors: Partial<Record<keyof T, string>>
}

export function rehydrateForm<T extends Record<string, any>>(
  rawData: Record<string, any>,
  errors: Partial<Record<keyof T, string>> = {},
  transform?: Partial<Record<keyof T, (value: any) => any>>
): RehydratedForm<T> {
  const values: Partial<Record<keyof T, any>> = {}

  for (const key in rawData) {
    const typedKey = key as keyof T

    values[typedKey] = transform?.[typedKey]
      ? transform[typedKey]!(rawData[key])
      : rawData[key]
  }

  return {
    values,
    errors,
  }
}
