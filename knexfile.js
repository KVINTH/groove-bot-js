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
      database: process.env.DATABASE_URL || process.env.PGDATABASE,
      host: process.env.PGHOST,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
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