const supertest = require('supertest');
const pkg = require('pg');
const { Pool } = pkg;
const client = require('../poolClient')
const config = require('../config/config')
app = require('../app')


const testShortUrl = "HSJD7shsa2"
const testLongUrl = "https://www.google.com"
const testRequestBody = {
  longUrl: "www.testiosoite.com"
}

describe('Testing the most important backend and database interactions', () => {

  beforeAll(async () => {
    const pool = new Pool({
      database: config.POSTGRES_DB,
      user: config.POSTGRES_USER,
      password: config.POSTGRES_PASSWORD,
      //host: config.POSTGRES_USER, 
      port: config.POSTGRES_PORT,
      max: 1, // Reuse the connection to make sure we always hit the same temporal schema
      idleTimeoutMillis: 0 // Disable auto-disconnection of idle clients to make sure we always hit the same temporal schema
    })
  
    client.query = (text, values) => {
      return pool.query(text, values)
    }
    
  })

  beforeAll(async () => {
    await client.query('CREATE TEMPORARY TABLE urls (LIKE urls INCLUDING ALL)')
    await client.query('CREATE TEMPORARY TABLE url_stats (LIKE url_stats INCLUDING ALL)')
    await client.query('INSERT INTO pg_temp.urls ("short_url", "long_url") VALUES ($1, $2)', [testShortUrl, testLongUrl])
    await client.query('INSERT INTO pg_temp.url_stats ("short_url", "click_count") VALUES ($1, $2)', [testShortUrl, 0])
  })

  afterAll(async () => {
    await client.query('DROP TABLE IF EXISTS pg_temp.urls')
    await client.query('DROP TABLE IF EXISTS pg_temp.url_stats')
  })

  test('Test short url creation', async () => {
    await supertest(app)
      .post('/shortUrl')
      .send(testRequestBody)
      .expect(200)
      .expect('Content-Length', '10') //returns id which is 10 characters long
  })

  test('Test redirect from short url', async () => {
    await supertest(app)
      .get(`/u/${testShortUrl}`)
      .expect(302)
      .expect('Location', testLongUrl)
  })

})