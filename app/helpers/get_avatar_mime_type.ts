/**
 * Infer mime type from filename
 */
export function getAvatarMimeType(filename: string): string {
  if (filename.endsWith('.png')) return 'image/png'
  if (filename.endsWith('.webp')) return 'image/webp'
  if (filename.endsWith('.avif')) return 'image/avif'
  return 'image/jpeg'
}