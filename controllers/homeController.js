const { CustomMessage } = require('../helpers/customMessage')

class homeController {
  constructor(req, res) {
    this.req = req
    this.res = res
    this.msg = new CustomMessage(res)
  }

  // Get Index
  async Index() {
    const { req, res, msg } = this

    return res.render('home-join', { room: req.session.room, userid: req.session.user.id, username: req.session.user.name })
  }
}

module.exports = {
  homeController
}