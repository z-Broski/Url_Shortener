var { nanoid } = require('nanoid');
const config = require('../config/config')
const poolClient = require('../poolClient')

/* Redirect from short url to the actual url. If short url isn't found, redirect to home page. 
   Update urls statistics. */
const redirectToShortUrl = async(req, res) => {
    console.log("Trying to redirect to short url: " + req.params.shortUrl)
    const findLongUrlQuery = {
        text: "SELECT long_url FROM urls WHERE short_url = $1",
        values: [req.params.shortUrl],
    }
    try {
        const response = await poolClient.query(findLongUrlQuery.text, findLongUrlQuery.values)
        //redirect wrong short urls to main page
        if (response.rows.length === 0) {
            console.log(`${req.params.shortUrl} not found. Redirecting to ${config.FRONTEND_URL}`)
            res.redirect(config.FRONTEND_URL)
        } else {
            await upsertUrlStats(req.params.shortUrl)
            const redirectUrl = validateRedirectUrl(response.rows[0].long_url)
            console.log(`Redirecting to ${redirectUrl}`)
            res.redirect(redirectUrl)
        }
    } catch (err) {
        console.error("Error caught: " + err.stack)
        res.sendStatus(500)
    }
}

/* Get statistics for a short url if it exists in db */
const getStats = async(req, res) => {

    console.log(`Trying to get statistics for short url: ${req.params.shortUrl}`)
    const urlExists = await shortUrlExists(req.params.shortUrl)
    if (urlExists) {
        const getStatsQuery = {
            text: "SELECT id, short_url, TO_CHAR(event_date, 'DD.MM.YYYY') event_date, click_count FROM url_stats WHERE short_url = $1",
            values: [req.params.shortUrl],
        }

        try {
            const response = await poolClient.query(getStatsQuery.text, getStatsQuery.values)
            console.log(`Statistics for short url ${req.params.shortUrl}: ${JSON.stringify(response.rows)}`)
            res.send(JSON.stringify(response.rows));
        } catch (err) {
            console.error("Error caught: " + err.stack)
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(404);
    }
}

/* Create short url */
//todo: Validate if generated nanoid has already been used as shortUrl
const createShortUrl = async(req, res) => {
    console.log(`Trying to generate a new short url`)
    const shortUrl = nanoid(10)
    const createShortUrlQuery = {
        text: 'INSERT INTO "urls" ("short_url", "long_url") VALUES ($1, $2)',
        values: [shortUrl, req.body.longUrl],
    }
    try {
        await poolClient.query(createShortUrlQuery.text, createShortUrlQuery.values);
        console.log(`Created a new short url: ${shortUrl}`)
        res.send(shortUrl);
        return(shortUrl) //for test case
    } catch (err) {
        console.error("Error caught: " + err.stack)
        res.sendStatus(500)
    }
}

/* Delete short url and its statistics from db */ 
const deleteShortUrl = async(req, res) => {
    console.log(`Trying to delete short url and its stats: ${req.params.shortUrl}`)

    const deleteFromUrlsQuery = {
        text: "DELETE FROM urls WHERE short_url = $1",
        values: [req.params.shortUrl],
    }

    const deleteFromUrlStatsQuery = {
        text: "DELETE FROM url_stats WHERE short_url = $1",
        values: [req.params.shortUrl],
    }

    try {
        await poolClient.query(deleteFromUrlsQuery.text, deleteFromUrlsQuery.values)
        console.log(`Deleted short url: ${req.params.shortUrl}`)
    } catch (err) {
        console.error("Error caught when removing " + req.params.shortUrl + " from urls: " + err.stack)
        res.sendStatus(500)
    }

    try {
        await poolClient.query(deleteFromUrlStatsQuery.text, deleteFromUrlStatsQuery.values)
        console.log(`Deleted short urls stats: ${req.params.shortUrl}`)
    } catch (err) {
        console.error("Error caught when removing url stats of " + req.params.shortUrl + ": " + err.stack)
        res.sendStatus(500)
    }
    res.sendStatus(204)
}

/* Check if shortUrl exists in database */
const shortUrlExists = async (shortUrl) => {
    const shortUrlExistsQuery = {
        text: "SELECT * FROM urls WHERE short_url = $1",
        values: [shortUrl]
    }
    try {
        const response = await poolClient.query(shortUrlExistsQuery.text, shortUrlExistsQuery.values)
        if (response.rowCount != 0) {
            return true
        }
    } catch (err) {
        console.error("Error caught: " + err.stack)
    }
    return false
}

/* Add a new row to url_stats table if short_url for current date doesn't exist. 
   Add +1 to click_count if short_url exists for current date. */
const upsertUrlStats = async (shortUrl) => {
    
    console.log(`Upsert url_stats of ${shortUrl}`)

    const upsertQuery = {
        text: `INSERT INTO "url_stats" ("short_url", "click_count") VALUES ($1, $2) ON CONFLICT (short_url, event_date) 
        DO UPDATE SET click_count = url_stats.click_count + 1`,
        values: [shortUrl, 1]
    }

    try {
        await poolClient.query(upsertQuery.text, upsertQuery.values);
    } catch (err) {
        console.error("Upserting url statistics for " + shortUrl + " failed: " + err.stack)
    } 
}

//todo: Better validating
const validateRedirectUrl = (url) => {
    if (url.startsWith("https:") || url.startsWith("http:")) {
        return url
    } else {
        return("https://" + url)
    } 
}

module.exports = { redirectToShortUrl, getStats, createShortUrl, deleteShortUrl }