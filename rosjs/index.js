const WebSocket = require('ws')
const argv = require('minimist')(process.argv.slice(2))

const ws = new WebSocket('ws://' + argv.ros_master + ':9090/')

ws.on('open', function open() {
  console.log('Connection open')
  const subscribe = JSON.stringify({
    'op': 'subscribe',
    'topic': '/turtle1/pose'
  })
  ws.send(subscribe)
})

ws.on('message', function incoming(data) {
  console.log(data)
})

function move_turtle(ws, x) {
  const cmd = JSON.stringify({
    'op': 'publish',
    'topic': '/turtle1/cmd_vel',
    'msg': {
      'linear': {
        'x': x,
        'y': 5.0,
        'z': 5.0
      },
      'angular': {
        'x': 5.0,
        'y': 5.0,
        'z': 5.0
      }
    }
  })
  ws.send(cmd)
}