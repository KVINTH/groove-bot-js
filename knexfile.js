module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite3',
    },
    useNullAsDefault: true,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    acquireConnectionTimeout: 600000,
    pool: {
      min: 0,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}