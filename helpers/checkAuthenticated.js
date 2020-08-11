
const checkAlreadyLogin = (req, res, next) => {
  if (req.session.user != null) {
    return res.redirect(`${req.protocol}://${req.headers.host}/`)
  }
  next()
}

const checkNotLogin = (req, res, next) => {
  if (req.session.user == null) {
    return res.redirect(`${req.protocol}://${req.headers.host}/signin/login`)
  }
  next()
}

const checkRoleAdmin = (req, res, next) => {
  if (req.session.user == null) {
    return res.redirect(`${req.protocol}://${req.headers.host}/`)
  }
  next()
}

module.exports = {
  checkAlreadyLogin,
  checkNotLogin,
  checkRoleAdmin
}