const WebSocket = require('ws')

class BridgeHandler {
  constructor (url) {
    this.ws = new WebSocket(url)
    this.events = {}
  }

  registerEvent (eventName, fn) {
    if (this.events[eventName]) {
      this.events[eventName].push(fn)
    } else {
      this.events[eventName] = [fn]
      this._addEventListener(eventName)
    }
  }

  send (cmd) {
    this.ws.send(JSON.stringify(cmd))
  }

  subscribe (topic, handlerFn) {
    this.send({
      'op': 'subscribe',
      'topic': topic
    })
    this.registerEvent('message', data => {
      data = JSON.parse(data)
      if (data.topic === topic) handlerFn(data)
    })
  }

  _addEventListener (eventName) {
    this.ws.on(eventName, data => {
      for (const fn of this.events[eventName]) {
        fn(data)
      }
    })
  }
}

module.exports = BridgeHandler
