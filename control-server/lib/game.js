/* global log */
const hueService = require('./HueService')
const DISABLE_LIDAR = true // do not wait for lidar to transition into CONT state

const HIT_TIMEOUT = 10 // s
class GameState {
  constructor (cobot) {
    this.states = ['STANDBY',
      'MOVE_1', 'WAIT_FOR_HIT_1', 'HIT_1', 'CONT_1',
      'MOVE_2', 'WAIT_FOR_HIT_2', 'HIT_2', 'CONT_2',
      'MOVE_3', 'WAIT_FOR_HIT_3', 'HIT_3', 'CONT_3',
      'ERROR', 'END'
    ]

    this.currentState = null
    this.reactionTimeSum = 0
    this.poseStartMs = null
    this.hitTimeoutTimer = null
    this.cobot = cobot
    cobot.emitter.on('position_reached', event => this.reachedPose())
    cobot.emitter.on('collision_detected', event => this.collisionDetected())
    hueService.setLight('off', 'red', 40)
  }
  transitionState (targetState) {
    log.info('State transition', {currentState: this.currentState, targetState})
    this.currentState = targetState
    this.execState()
  }
  mockSafetyNet () {
    if (DISABLE_LIDAR) {
      setTimeout(() => this.safetyNetExited(), 2000)
    }
  }
  startTimeout () {
    this.hitTimeoutTimer = setTimeout(() => this.timeoutDetected(this.currentState), HIT_TIMEOUT * 1000) // s -> ms
  }
  // state actions
  execState () {
    switch (this.currentState) {
      case 'STANDBY':
        this.cobot.resetCollision()
        hueService.setLight('on', 'red', 40)
        setTimeout(() => this.transitionState('MOVE_1'), 1000)
        break
      case 'MOVE_1':
        hueService.setLight('on', 'red', 40)
        this.cobot.moveToPose(0) // lol IT
        break
      case 'WAIT_FOR_HIT_1':
        hueService.setLight('on', 'green', 30)
        this.startTimeout()
        this.poseStartMs = new Date()
        break
      case 'HIT_1':
        hueService.setLight('on', 'red', 50)
        this.reactionTimeSum += new Date() - this.poseStartMs
        clearTimeout(this.hitTimeoutTimer)
        this.mockSafetyNet() // use mock instead of LiDAR if disabled
        break
      case 'CONT_1':
        this.cobot.resetCollision()
          .then(() => this.transitionState('MOVE_2'))
        break
      case 'MOVE_2':
        hueService.setLight('on', 'red', 50)
        this.cobot.moveToPose(1)
        break
      case 'WAIT_FOR_HIT_2':
        hueService.setLight('on', 'green', 40)
        this.startTimeout()
        this.poseStartMs = new Date()
        break
      case 'HIT_2':
        hueService.setLight('on', 'red', 40)
        this.reactionTimeSum += new Date() - this.poseStartMs
        clearTimeout(this.hitTimeoutTimer)
        this.mockSafetyNet() // use mock instead of LiDAR if disabled
        break
      case 'CONT_2':
        this.cobot.resetCollision()
          .then(() => this.transitionState('MOVE_3'))
        break
      case 'MOVE_3':
        hueService.setLight('on', 'red', 40)
        this.cobot.moveToPose(2)
        break
      case 'WAIT_FOR_HIT_3':
        hueService.setLight('on', 'green', 40)
        this.startTimeout()
        this.poseStartMs = new Date()
        break
      case 'HIT_3':
        hueService.setLight('on', 'red', 40)
        this.reactionTimeSum += new Date() - this.poseStartMs
        clearTimeout(this.hitTimeoutTimer)
        this.mockSafetyNet() // use mock instead of LiDAR if disabled
        break
      case 'CONT_3':
        this.cobot.resetCollision()
          .then(() => this.transitionState('END'))
        break
      case 'END':
        hueService.setLight('on', 'yellow', 40)
        log.info('GAME ENDED')
        break
      case 'ERROR':
        hueService.setLight('on', 'purple', 40)
        log.error('Something went wrong')
        break
    }
  }
  // events
  collisionDetected () {
    switch (this.currentState) {
      case 'WAIT_FOR_HIT_1':
        this.transitionState('HIT_1')
        break

      case 'WAIT_FOR_HIT_2':
        this.transitionState('HIT_2')
        break

      case 'WAIT_FOR_HIT_3':
        this.transitionState('HIT_3')
        break
      default:
        this.transitionState('ERROR')
    }
  }

  timeoutDetected () {
    switch (this.currentState) {
      case 'WAIT_FOR_HIT_1':
        this.transitionState('ERROR')
        break

      case 'WAIT_FOR_HIT_2':
        this.transitionState('ERROR')
        break

      case 'WAIT_FOR_HIT_3':
        this.transitionState('ERROR')
        break

      default:
        log.info('Unhandled timeout', {state: this.currentState})
    }
  }

  reachedPose () {
    switch (this.currentState) {
      case 'MOVE_1':
        this.transitionState('WAIT_FOR_HIT_1')
        break

      case 'MOVE_2':
        this.transitionState('WAIT_FOR_HIT_2')
        break

      case 'MOVE_3':
        this.transitionState('WAIT_FOR_HIT_3')
        break

      default:
        log.warn('Unhandled timeout', {state: this.currentState})
    }
  }

  safetyNetExited () {
    switch (this.currentState) {
      case 'HIT_1':
        this.transitionState('CONT_1')
        break

      case 'HIT_2':
        this.transitionState('CONT_2')
        break

      case 'HIT_3':
        this.transitionState('CONT_3')
        break

      default:
        log.warn('Unhandled timeout', {state: this.currentState})
    }
  }
}

module.exports = GameState
