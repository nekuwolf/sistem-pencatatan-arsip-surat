/**
 * Converts VineJS/Adonis validation error messages array 
 * into a key-value object for easier view rendering.
 */
export function mapVineJSValidationErrorMessages(error: any): Record<string, string> {
  if (!error.messages || !Array.isArray(error.messages)) {
    return {}
  }

  return error.messages.reduce((acc: any, curr: any) => {
    // We only take the first error message for each field
    if (!acc[curr.field]) {
      acc[curr.field] = curr.message
    }
    return acc
  }, {} as Record<string, string>)
}