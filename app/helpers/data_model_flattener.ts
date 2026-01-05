import type { LucidRow } from '@adonisjs/lucid/types/model'

// Define the shape of the transform object
type Transform<Model extends LucidRow> = Partial<Record<keyof Model, (value: any) => any>>

/**
 * OVERLOAD 1: Handling an Array of Models
 */
export function dataModelFlattener<Model extends LucidRow>(
  data: Model[],
  transform?: Transform<Model>
): Partial<Record<keyof Model, any>>[]

/**
 * OVERLOAD 2: Handling a Single Model (or null/undefined)
 */
export function dataModelFlattener<Model extends LucidRow>(
  data: Model | null | undefined,
  transform?: Transform<Model>
): Partial<Record<keyof Model, any>>

/**
 * IMPLEMENTATION
 */
export function dataModelFlattener<Model extends LucidRow>(
  data: Model | Model[] | null | undefined,
  transform?: Transform<Model>
): any { // 'any' is used internally for implementation, overloads handle external safety

  // 1. Helper to process a single instance
  const processSingle = (item: Model) => {
    // Serialize to standard plain object (respects hidden fields)
    const rawData = item.serialize()
    const processed: any = {}

    // Apply transforms
    for (const key in rawData) {
      const typedKey = key as keyof Model
      processed[typedKey] = transform?.[typedKey]
        ? transform[typedKey]!(rawData[key])
        : rawData[key]
    }
    return processed
  }

  // 2. Handle Array Input
  if (Array.isArray(data)) {
    return data.map((item) => processSingle(item))
  }

  // 3. Handle Single Input (Null check included)
  if (!data) {
    return {} // Return empty object if data is null, or use `null` depending on your preference
  }

  return processSingle(data)
}