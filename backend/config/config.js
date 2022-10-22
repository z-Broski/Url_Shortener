require('dotenv').config()

const config = {
    PORT: process.env.PORT || 3001,
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    POSTGRES_DB: process.env.POSTGRES_DB || 'db',
    POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres',
    POSTGRES_PORT: process.env.POSTGRES_PORT || 5432,
}

module.exports = config 