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
        'resources/js/utils/input_actions.js',
        'resources/js/components/sidebar.js',
        'resources/js/components/profile_picture.js',
        'resources/css/app.scss',
        'resources/css/pages/dashboard.scss',
        'resources/css/pages/login.scss',
        'resources/css/pages/register.scss',
        'resources/css/pages/verify_otp.scss',
        'resources/css/components/profile_picture.scss'
      ],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.edge'],
    }),
  ],
})
