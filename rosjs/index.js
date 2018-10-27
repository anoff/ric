/* global log */
const pino = require('pino')
const minimist = require('minimist')
const BridgeHandler = require('./lib/bridgeHandler')
const server = require('./lib/web')

const argv = minimist(process.argv.slice(2))
global.log = pino()
const websocketUrl = 'ws://' + argv.ros_master + ':9090/'
const ros = new BridgeHandler(websocketUrl)

ros.ws.on('open', () => {
  log.info('Connection open')
  init()
})

function init () {
  server.start()
  server.getSocket().on('connection', socket => {
    log.info('socket connected')
    socket.on('move', data => {
      log.debug('socket move command', data)
      ros.call('/festo/cobotv1_1/jog_xyzabc', {
        pose: data,
        velocity_factor: 0.5,
        acceleration_factor: 0.5,
        relative_position: true,
        coordinate_system: 'TCP',
        time_factor: 0.5
      })
    })
  })
  ros.subscribe('/festo/cobotv1_1/base_to_tcp_transform', data => {
    // console.log(JSON.stringify(data))
  })

  let toolClosed = true
  setInterval(() => {
    // closeTool(toolClosed)
    toolClosed = !toolClosed
    /* ros.call('/festo/cobotv1_1/jog_xyzabc', {
      pose: {
        position: {x: 0.0, y: 0.0, z: 0.0},
        orientation: {x: 0.0, y: 0.0, z: 0.0, w: 0.0}
      },
      velocity_factor: 0.5,
      acceleration_factor: 0.5,
      relative_position: false,
      coordinate_system: 'TCP',
      time_factor: 0.5
    }) */
  }, 3000)
}

function closeTool (closed) {
  ros.call('/festo/cobotv1_1/set_pressure', {
    'required_pressure': {
      'sequence': 0,
      'p1': closed ? 1.0 : -1.0,
      'p2': 0.0,
      'weight': 0.1
    }
  }, {hideCall: true})
}
