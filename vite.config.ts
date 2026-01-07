import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    adonisjs({
      /**
       * Entrypoints of your application. Each entrypoint will
       * result in a separate bundle.
       */
      entrypoints: [
        'resources/js/app.js',
        'resources/css/app.scss',
        'resources/css/pages/dashboard.scss',
        'resources/css/pages/login.scss',
        'resources/css/pages/register.scss',
        'resources/css/components/profile_picture.scss'
      ],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.edge'],
    }),
  ],
  server: {
    allowedHosts: [
      'sandbox.nekuwolf.my.id' // Add your tunnel domain here
    ],
  },
})
