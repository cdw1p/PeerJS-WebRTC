const express = require('express')
const session = require('express-session')
const morgan = require('morgan')
const path = require('path')
const responseTime = require('response-time')
const minifyHTML = require('express-minify-html-2')
const app = express()

// Use session
app.use(session({
  name: 'SSO_SESSION',
  secret: '{P3L1ND0GROUP}{PUS4T-2020}',
  resave: false,
  saveUninitialized: true,
  cookie: { expires: new Date(Date.now() + 60*1000), path: '/', httpOnly: true, secure: false, maxAge: null }
}))

// Server configuration parsing data & cors
app.enable('trust proxy')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static('public', { maxAge: 31557600 }))

// X-Response-Time header to responses
app.use(responseTime())

// HTML minifier to clientside
app.use(minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true
  }
}))

// View engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', require('ejs').__express) 

// API management
const Routes = require('./routes')
Routes.initialize(app)
// Global middleware express

app.use('*', function(req, res) {
  return res.redirect(`${req.protocol}://${req.headers.host}/`)
})

// App middleware - error handling
app.use(require('./middleware/errorMiddleware').all)

module.exports = app