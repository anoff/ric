/* global io */
const socket = io.connect(window.location.href)

socket.on('reconnect', cnt => console.log('reconnect:' + cnt))
socket.on('connect', () => console.log('connected'))

socket.on('topic', m => console.log('topic', m))

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
  socket.emit('move', relativePose)
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
      stepXYZabc({y: INCREMENT})
      break
    case 'arrowleft':
    case 'buttonleft':
      stepXYZabc({y: -INCREMENT})
      break
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
