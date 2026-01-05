import app from '@adonisjs/core/services/app'
import { defineConfig, services } from '@adonisjs/drive'

const driveConfig = defineConfig({
  default: 'localStoragePrivate',

  services: {
    /**
     * Persist files on the local filesystem
     */
    localStoragePrivate: services.fs({
      location: app.makePath('storage'),
      serveFiles: false,
      visibility: 'private',
    }),

    uploadsPublic: services.fs({
      location: app.makePath('storage'),
      serveFiles: true,
      routeBasePath: '/uploads',
      visibility: 'public',
    }),
    
  },
})

export default driveConfig

/**
 * This tells TypeScript to scan the "driveConfig" object
 * and register 'localStoragePrivate' and 'uploadsPublic'
 * as valid disk names.
 */
declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
