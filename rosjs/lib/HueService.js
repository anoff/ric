const hue = require('node-hue-api')

const HueApi = hue.HueApi
const lightState = hue.lightState

const host = '172.16.4.1'
const username = '1jKNLVJMfXVnfAa16EBROviTmV-wfO1iF5thYW0N'
const api = new HueApi(host, username)

const displayError = (err) => {
  console.log(err)
}

function setLight (switchState = 'off', color = 'white', brightness = 10) {
  let state

  if (switchState === 'off') {
    state = lightState
      .create()
      .transitiontime(0)
      .off()
  } else {
    let hue
    switch (color) {
      case 'green':
        hue = 120
        break
      case 'red':
        hue = 0
        break
      case 'yellow':
        hue = 60
        break
      case 'blue':
        hue = 240
        break
      case 'purple':
        hue = 300
        break
      default:
        hue = 180
    }
    state = lightState
      .create()
      .on()
      .brightness(brightness)
      .sat(255)
      .transitiontime(0)
      .hsl(hue, 100, 10)
  }

  api.setLightState(2, state)
    .then((res) => console.log(`Changed state to ${switchState}, ${color}, ${brightness}`))
    .catch(displayError)
    .done()
}

module.exports = {
  setLight
}
