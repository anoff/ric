/* global log */
// functions and events to interact with the cobot
const EventEmitter = require('events')

const ERROR_MODE = 7
const absoluteJointPoses = [
  [-0.972759544849396, 0.842011630535126, 0.525173485279083, -0.459920525550842, -0.311721533536911, -0.23040871322155, -1.61112463474274],
  [-0.45693451166153, 0.846364200115204, 0.527738392353058, -0.464820146560669, -0.311230331659317, -0.23233450949192, -1.60969400405884],
  [-1.48576176166534, 0.831790685653687, 0.523841917514801, -0.443036943674088, -0.31352910399437, -0.220870584249496, -1.60924172401428]
]

class Cobot {
  constructor (ros) {
    this.ros = ros
    this.emitter = new EventEmitter()
    this.previousMode = null
  }

  moveToPose (poseId) {
    const ix = poseId % absoluteJointPoses.length
    this._moveToAbsoluteJointPose(absoluteJointPoses[ix])
  }

  _moveToAbsoluteJointPose (jointPose) {
    this.ros.call('/festo/cobotv1_1/jog_joints', {
      joint_increment: jointPose,
      velocity_factor: 1.0,
      acceleration_factor: 0.8,
      relative_position: false,
      time_factor: 0.5
    }, {
      hideCall: false
    })
  }

  resetCollision () {
    this.ros.call('/festo/cobotv1_1/set_mode', {required_mode: 7, sequence: 0})
  }

  init () {
    // bind to reached position responses and fire event
    this.ros.ws.addEventListener('message', d => {
      d = JSON.parse(d.data)
      if (d.op === 'service_response' && d.service === '/festo/cobotv1_1/jog_joints' && d.values.position_reached) {
        this.emitter.emit('position_reached', d)
      }
    })

    // check for start of collission
    this.ros.subscribe('/festo/cobotv1_1/festo_status', data => {
      if (data.mode === ERROR_MODE && this.previousMode !== ERROR_MODE) {
        log.warn('Collision detected', data)
        this.emitter.emit('collision_detected', data)
      }
      this.previousMode = data.mode
    })
  }
}

module.exports = Cobot
