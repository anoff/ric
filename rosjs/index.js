const argv = require('minimist')(process.argv.slice(2))
const BridgeHandler = require('./lib/bridgeHandler')
const websocketUrl = 'ws://' + argv.ros_master + ':9090/'

const ros = new BridgeHandler(websocketUrl)

ros.ws.on('open', () => {
  console.log('Connection open')
  init()
})

function init () {
  ros.subscribe('/festo/cobotv1_1/festo_status', data => {
    if (data.msg.sequence % 10 === 0) console.log(JSON.stringify(data))
  })
}

function closeTool (closed) {
  const cmd = JSON.stringify(
    { 'op': 'call_service',
      'service': '/festo/cobotv1_1/set_pressure',
      'args': {
        'required_pressure': {
          'sequence': 0,
          'p1': closed ? 1.0 : -1.0,
          'p2': 0.0,
          'weight': 0.1
        }
      }
    })
  ws.send(cmd)
  console.log(cmd)
}
