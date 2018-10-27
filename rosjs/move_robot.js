const WebSocket = require('ws')
const argv = require('minimist')(process.argv.slice(2))

const ws = new WebSocket('ws://' + argv.ros_master + ':9090/')

ws.on('open', function open() {
    console.log('Connection open')
    pose_1(ws)

})

ws.on('message', function incoming(data) {
    console.log(data)
})

function pose_1(ws) {
    const cmd = JSON.stringify({
        'op': 'publish',
        'topic': '/festo/cobot_v1_1',
        'msg': {
            'joint_positions': {
                'x': x,
                'y': 5.0,
                'z': 5.0
            }
        }
    })
    ws.send(cmd)
}