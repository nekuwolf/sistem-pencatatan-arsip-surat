// import type { LucidRow } from '@adonisjs/lucid/types/model'
// import string from '@adonisjs/core/helpers/string' // Import Adonis string helper

// export type PopulatedForm<Model extends LucidRow> = {
//   values: Record<string, any>
// }

// /**
//  * Populates form values directly from a Lucid Model instance.
//  * - Automatically converts keys to snake_case (e.g., userId -> user_id)
//  * - Allows manual overrides for specific fields
//  */
// export function populateForm<Model extends LucidRow>(
//   modelInstance: Model | null | undefined,
//   transform?: Partial<Record<keyof Model, (value: any) => any>>,
//   rename?: Partial<Record<keyof Model, string>>
// ): PopulatedForm<Model> {
//   const values: Record<string, any> = {}

//   // serialize() usually returns camelCase keys (e.g., createdAt, userId)
//   const rawData = modelInstance ? modelInstance.serialize() : {}

//   for (const key in rawData) {
//     const typedKey = key as keyof Model

//     // 1. Determine Key Name
//     // Priority: Manual Rename > Automatic Snake Case
//     const finalKey = rename?.[typedKey] 
//       ? rename[typedKey]!           // Use manual name if provided (e.g., "gender_name")
//       : string.snakeCase(key)       // Otherwise auto-convert (e.g., "userId" -> "user_id")

//     // 2. Determine Value
//     const finalValue = transform?.[typedKey]
//       ? transform[typedKey]!(rawData[key])
//       : rawData[key]

//     values[finalKey] = finalValue
//   }

//   return {
//     values,
//   }
// }