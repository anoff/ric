/* global log */
const pino = require('pino')
const minimist = require('minimist')
const BridgeHandler = require('./lib/bridgeHandler')

const argv = minimist(process.argv.slice(2))
global.log = pino()
const websocketUrl = 'ws://' + argv.ros_master + ':9090/'
const ros = new BridgeHandler(websocketUrl)

ros.ws.on('open', () => {
  log.info('Connection open')
  init()
})

function init () {
  /*
  ros.subscribe('/festo/cobotv1_1/festo_status', data => {
    if (data.msg.sequence % 10 === 0) console.log(JSON.stringify(data))
  })
  */
  let toolClosed = true
  setInterval(() => {
    closeTool(toolClosed)
    toolClosed = !toolClosed
  }, 1000)
}

function closeTool (closed) {
  ros.call('/festo/cobotv1_1/set_pressure', {
    'required_pressure': {
      'sequence': 0,
      'p1': closed ? 1.0 : -1.0,
      'p2': 0.0,
      'weight': 0.1
    }
  })
}
