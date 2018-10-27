/* global io */
const socket = io.connect(window.location.href)

socket.on('reconnect', cnt => console.log('reconnect:' + cnt))
socket.on('connect', () => console.log('connected'))

socket.on('topic', m => console.log('topic', m))

// relative movement
function stepXYZabc (pose) {
  const relativePose = {
    position: {
      x: pose.x || 0,
      y: pose.y || 0,
      z: pose.z || 0
    },
    orientation: {
      x: pose.a || 0,
      y: pose.b || 0,
      z: pose.c || 0
    }
  }
  socket.emit('move', {
    pose: relativePose,
    velocity_factor: 0.5,
    acceleration_factor: 0.5,
    relative_position: true,
    coordinate_system: 'base_link',
    time_factor: 0.5
  })
}
// move to absolute positions
function moveToXYZabc (pose) {
  const absolutePose = {
    position: {
      x: pose.x || 0,
      y: pose.y || 0,
      z: pose.z || 0
    },
    orientation: {
      x: pose.a || 0,
      y: pose.b || 0,
      z: pose.c || 0,
      w: pose.w || 0
    }
  }
  socket.emit('move', {
    pose: absolutePose,
    velocity_factor: 0.5,
    acceleration_factor: 0.5,
    relative_position: false,
    coordinate_system: 'base_link',
    time_factor: 0.5
  })
}

// set joints
function setJoints () {
  const joints = {
"joint_increment: [0.1, 0,0.1, 0, 0, 0, 0]
velocity_factor: 0.5
acceleration_factor: 0.5
time_factor: 0.5
relative_position: true"
  }
}
// --- arrow inputs ---
window.addEventListener('keydown', e => {
  buttonHandler(e.key)
  toggleStyle(e.key, 'keydown')
})
function toggleStyle (key, event) {
  const button = key.toLowerCase().replace('arrow', 'button')
  if (Object.keys(buttons).indexOf(button.toLowerCase()) > -1) {
    if (event === 'keydown') {
      buttons[button].classList.add('mdl-button--colored')
    } else {
      buttons[button].classList.remove('mdl-button--colored')
    }
  }
}
const INCREMENT = 0.05
function buttonHandler (key) {
  switch (key.toLowerCase()) {
    case 'arrowup':
    case 'buttonup':
      stepXYZabc({x: INCREMENT})
      break
    case 'arrowdown':
    case 'buttondown':
      stepXYZabc({x: -INCREMENT})
      break
    case 'arrowright':
    case 'buttonright':
      stepXYZabc({z: INCREMENT})
      break
    case 'arrowleft':
    case 'buttonleft':
      stepXYZabc({z: -INCREMENT})
      break
    case '1':
      moveToXYZabc({
        x: -0.3,
        y: 0.5,
        z: 0.1,
        a: 0.33,
        b: 0.7,
        c: 0.3,
        w: -0.55})
      break
    case '2':
      moveToXYZabc({
        x: 0,
        y: 0.45,
        z: -0.1,
        a: -0.47,
        b: -0.65,
        c: -0.3,
        w: 0.5})
      break
    case '3':
      moveToXYZabc({
        x: -0.4,
        y: 0.15,
        z: 0.4,
        a: -0.05,
        b: 0.4,
        c: 0.3,
        w: -0.8})
      break
    case '4':
      moveToXYZabc({
        x: -0.36,
        y: 0.34,
        z: -0.06,
        a: -0.4,
        b: 0.5,
        c: 0.77,
        w: 0.08})
      break

    default:
      console.log('Unhandled button', key)
  }
}
window.addEventListener('keyup', e => {
  stop()
  toggleStyle(e.key, 'keyup')
})
function stop () {
  // do nothing
}
// --- button inputs ---
const buttons = {
  buttonup: document.querySelector('#button_up'),
  buttondown: document.querySelector('#button_down'),
  buttonright: document.querySelector('#button_right'),
  buttonleft: document.querySelector('#button_left')
}

Object.keys(buttons).forEach(key => {
  buttons[key].addEventListener('mousedown', () => buttonHandler(key))
  buttons[key].addEventListener('touchstart', () => buttonHandler(key))
  buttons[key].addEventListener('mouseup', () => stop())
  buttons[key].addEventListener('mouseout', () => stop())
  buttons[key].addEventListener('touchend', () => stop())
  buttons[key].addEventListener('touchmove', () => stop())
})
