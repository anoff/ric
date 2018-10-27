const WebSocket = require('ws')

class BridgeHandler {
  constructor (url) {
    this.ws = new WebSocket(url)
    this.events = {}
  }

  send (cmd) {
    this.ws.send(JSON.stringify(cmd))
  }

  subscribe (topic, handlerFn) {
    this.send({
      'op': 'subscribe',
      'topic': topic
    })
    this.ws.addEventListener('message', data => {
      data = JSON.parse(data.data)
      if (data.topic === topic) handlerFn(data)
    })
  }
}

module.exports = BridgeHandler
