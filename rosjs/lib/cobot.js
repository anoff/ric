// functions and events to interact with the cobot

const absoluteJointPoses = [
  [-0.972759544849396, 0.842011630535126, 0.525173485279083, -0.459920525550842, -0.311721533536911, -0.23040871322155, -1.61112463474274],
  [-0.45693451166153, 0.846364200115204, 0.527738392353058, -0.464820146560669, -0.311230331659317, -0.23233450949192, -1.60969400405884],
  [-1.48576176166534, 0.831790685653687, 0.523841917514801, -0.443036943674088, -0.31352910399437, -0.220870584249496, -1.60924172401428]
]

class Cobot {
  constructor (ros) {
    this.ros = ros
  }

  moveToPose (poseId) {
    const ix = poseId % absoluteJointPoses.length
    this.moveToAbsoluteJointPose(absoluteJointPoses[ix])
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
    this.ros.call('/festo/cobotv1_1/set_mode', {
      sequence: 0,
      required_mode: 7
    }, {
      hideCall: false
    })
  }
}

module.exports = Cobot
