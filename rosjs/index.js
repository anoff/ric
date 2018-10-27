/* global log */
const pino = require('pino')
const minimist = require('minimist')
const BridgeHandler = require('./lib/bridgeHandler')
const Cobot = require('./lib/cobot')
const GameState = require('./lib/game')
const server = require('./lib/server')

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
  server.start()
  cobot.init()
  cobot.openHand(false)
  cobot.resetCollision()
}

server.emitter.on('start_game', d => {
  if (game.currentState === 'ERROR' || !game.currentState) {
    log.info('STARTING GAME')
    game.transitionState('STANDBY')
  }
})
