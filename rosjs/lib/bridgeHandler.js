/* global log */
const WebSocket = require('ws')

class BridgeHandler {
  constructor (url, opts = {}) {
    this.ws = new WebSocket(url)
    this.showServiceResponse = opts.showServiceResponse !== undefined ? opts.showServiceResponse : true

    this.ws.addEventListener('message', d => {
      d = JSON.parse(d.data)
      if (d.op === 'service_response' && this.showServiceResponse) {
        log.info(`SRV_RESPONSE(${d.service})=${d.result ? 'OK' : 'NOK'}: ${JSON.stringify(d.values)}`)
      }
    })
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

  call (service, args, opts = {}) {
    const cmd = JSON.stringify(
      { 'op': 'call_service',
        'service': service,
        'args': args
      })
    this.ws.send(cmd)
    if (!opts.hideCall) {
      log.info(`SRV_CALL(${service}): ${JSON.stringify(args)}`)
    }
  }
}

module.exports = BridgeHandler
