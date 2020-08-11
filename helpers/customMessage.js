const EventEmitter = require('events')
const events = new EventEmitter

class CustomMessage {
  constructor(res) {
    this.response = res
    this.events = events
  }

  // Custom message for handling success
  async success(event, statusCode, message) {
    let { response, events } = this
    events.once(event, () => {
      return response.status(statusCode).json(message)
    })
    return await events.emit(event)
  }

  // Custom message for handling error
  async error(event, statusCode, message) {
    let { response, events } = this
    events.once(event, () => {
      return response.status(statusCode).json(message)
    })
    return await events.emit(event)
  }
}

module.exports = { CustomMessage }