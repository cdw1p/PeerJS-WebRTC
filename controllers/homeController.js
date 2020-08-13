class homeController {
  constructor(req, res) {
    this.req = req
    this.res = res
  }

  // Get Index
  async Index() {
    const { req, res } = this

    return res.render('home-join', { room: req.session.room, userid: req.session.user.id, username: req.session.user.name })
  }
}

module.exports = {
  homeController
}