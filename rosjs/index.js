const WebSocket = require('ws')
const argv = require('minimist')(process.argv.slice(2))

const ws = new WebSocket('ws://' + argv.ros_master + ':9090/')

ws.on('open', function open () {
  console.log('Connection open')
  const subscribe = JSON.stringify({
    'op': 'subscribe',
    'topic': '/festo/cobotv1_1/festo_status'
  })
  // ws.send(subscribe)
})

ws.on('message', function incoming (data) {
  console.log(data)
})

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

process.stdin.on('data', d => {
  console.log(d)
})

let status = false
setInterval(() => {
  closeTool(status)
  status = !status
}, 1000)
