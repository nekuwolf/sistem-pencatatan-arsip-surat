import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'
import { SingularNamingStrategy } from '../app/strategies/singular_naming_strategy.js'

const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: app.tmpPath('db.sqlite3')
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig