const express = require('express')
const router = express.Router()
const routes = require('./routes')

router.get("/u/:shortUrl", routes.redirectToShortUrl);
router.get("/shortUrl/:shortUrl", routes.getStats);
router.post("/shortUrl", routes.createShortUrl);
router.delete("/shortUrl/:shortUrl", routes.deleteShortUrl);

module.exports = router
