const express = require('express')
const router = express.Router()
const { checkAlreadyLogin, checkNotLogin } = require('../helpers/checkAuthenticated')
const { homeController, signinController } = require('../controllers/allController')

module.exports.initialize = function(app) {
  // Route home
  app.use('/',
    router.get('/', checkNotLogin, (req, res) => {
      return new homeController(req, res).Index()
    })
  )
  
  // Route login
  app.use('/signin',
    router.get('/login', checkAlreadyLogin, (req, res) => {
      return new signinController(req, res).Index()
    }),
    router.post('/login', checkAlreadyLogin, (req, res) => {
      return new signinController(req, res).IndexPOST()
    })
  )
}