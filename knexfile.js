module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: '../database.sqlite3',
    },
    useNullAsDefault: true,
  },
  production: {
    client: 'pg',
    connection: {
      database: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}