/* global log */
const pino = require('pino')
const minimist = require('minimist')
const BridgeHandler = require('./lib/bridgeHandler')
const Cobot = require('./lib/cobot')
const GameState = require('./lib/game')

const argv = minimist(process.argv.slice(2))
global.log = pino()
const websocketUrl = 'ws://' + argv.ros_master + ':9090/'
const ros = new BridgeHandler(websocketUrl, {
  showServiceResponse: true
})
const cobot = new Cobot(ros)
const game = new GameState(cobot)

ros.ws.on('open', () => {
  log.info('Connection open')
  init()
})

function init () {
  cobot.init()
  ros.call('/festo/cobotv1_1/set_pressure', {
    'required_pressure': {
      'sequence': 0,
      'p1': 1.0,
      'p2': 0.0,
      'weight': 0.1
    }
  }, {hideCall: true})
  cobot.resetCollision()
}
