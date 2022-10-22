const server = require('./app')
const config = require('./config/config')

server.listen(config.PORT, () => {
    console.log("Started application on port %d", config.PORT);
});