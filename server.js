require('newrelic')

// This is a real hacky way of doing things. We need a better way.
process.env.ALIASES = JSON.stringify(require('./alias-config.json'))
process.env.VHOSTS = JSON.stringify(require('./vhost-config.json'))

var app = require('simple-odk')
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

// Start server
var port = process.env.PORT || 8080
app.listen(port)
console.log('Listening on port %s', port)
