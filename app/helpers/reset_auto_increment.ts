import db from '@adonisjs/lucid/services/db'

export async function resetAutoIncrement(tableName: string, startFrom: number) {
  const dialect = db.connection().dialect.name

  switch (dialect) {
    case 'mysql':
      await db.rawQuery(`ALTER TABLE ${tableName} AUTO_INCREMENT = ?`, [startFrom])
      break

    case 'postgres':
      // Assumes default naming convention: table_column_seq
      await db.rawQuery(`ALTER SEQUENCE ${tableName}_id_seq RESTART WITH ${startFrom}`)
      break

    case 'better-sqlite3':
      // SQLite only creates the sqlite_sequence entry after the first insert.
      await db.rawQuery(
        "UPDATE sqlite_sequence SET seq = ? WHERE name = ?", 
        [startFrom - 1, tableName]
      )
      break

    default:
      console.warn(`Auto-increment reset not supported for driver: ${dialect}`)
  }
}
