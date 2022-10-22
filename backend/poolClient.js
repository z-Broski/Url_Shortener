const pkg = require('pg');
const { Pool } = pkg;
const config = require('./config/config')

const pool = new Pool({
    database: config.POSTGRES_DB,
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    host: config.POSTGRES_USER, //comment this out when running without docker compose
    port: config.POSTGRES_PORT,
    max: 10, // Pool max size
    idleTimeoutMillis: 1000 // Close idle clients after 1 second
})

module.exports.query = (text, values) => {
    return pool.query(text, values)
}