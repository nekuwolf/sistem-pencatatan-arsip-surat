export default class AvatarGeneratorService {
  /**
   * Returns an SVG string for the given name
   */
  generate(fullName: string): string {
    const initials = this.getInitials(fullName)
    const color = this.stringToColor(fullName) // Generates consistent color

    // We return a string. Browsers read this as an image.
    return `
      <svg width="128" height="128" viewBox="0 0 128 128" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}" />
        <text 
          x="50%" 
          y="50%" 
          dy=".1em" 
          fill="#ffffff" 
          font-family="Arial, Helvetica, sans-serif" 
          font-size="64" 
          font-weight="bold"
          text-anchor="middle" 
          dominant-baseline="middle"
        >${initials}</text>
      </svg>
    `.trim()
  }

  /**
   * Turns "xxx yyy zzz" -> "XY"
   */
  private getInitials(name: string): string {
    if (!name) return '??'
    const parts = name.trim().split(/\s+/)

    let initials = parts[0][0] // First char of first name
    if (parts.length > 1) {
      // Add first char of the last name (or second name)
      initials += parts[parts.length - 1][0] 
    }
    
    return initials.toUpperCase()
  }

  /**
   * Generates a hex color based on the string chars.
   * "John" will always return the same color.
   */
  private stringToColor(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    // Convert to hex and ensure it's a valid color code
    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF
      color += ('00' + value.toString(16)).slice(-2)
    }
    return color
  }
}