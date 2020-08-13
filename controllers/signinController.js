const { v4: uuidV4 } = require('uuid')
const { FunctionSQLRawPrevent } = require('../helpers/sqlRawPrevent')

// Global Variable
const sessionRoomCreated = {}

class signinController {
  constructor(req, res) {
    this.req = req
    this.res = res
  }

  // Get Index
  async Index() {
    const { req, res } = this
    return res.render('signin-login', { error: false })
  }

  // Post Login
  async IndexPOST() {
    const { req, res } = this
    var reqUserName = await FunctionSQLRawPrevent(req.body.fullname.replace(/ /g, ''))
    var reqRoomName = await FunctionSQLRawPrevent(req.body.room.replace(/ /g, ''))

    if (reqUserName && reqRoomName) {
      if (sessionRoomCreated[reqRoomName]) {
        // Set Session & Redirect
        req.session.user = { id: await uuidV4(), name: reqUserName }
        req.session.room = sessionRoomCreated[reqRoomName]
        res.status(302).redirect('/')
      } else {
        // Set Session & Redirect
        sessionRoomCreated[reqRoomName] = { id: await uuidV4(), name: await FunctionSQLRawPrevent(req.body.room.replace(/ /g, '')), author: req.body.fullname }
        req.session.user = { id: await uuidV4(), name: reqUserName }
        req.session.room = sessionRoomCreated[reqRoomName]
  
        res.status(302).redirect('/')
      }
    } else {
      return res.render('signin-login', { error: true })
    }
  }
}

module.exports = {
  signinController
}