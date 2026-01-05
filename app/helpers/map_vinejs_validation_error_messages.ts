/**
 * Converts VineJS validation errors into a flat field-error map
 */
export function mapVineJSValidationErrorMessages<T extends Record<string, any>>(
  error: any
): Partial<Record<keyof T, string>> {
  if (!error?.messages || !Array.isArray(error.messages)) {
    return {}
  }

  return error.messages.reduce((acc: any, curr: any) => {
    const field = curr.field as keyof T

    // take only the first error per field
    if (!acc[field]) {
      acc[field] = curr.message
    }

    return acc
  }, {} as Partial<Record<keyof T, string>>)
}
