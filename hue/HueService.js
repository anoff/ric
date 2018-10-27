const hue = require('node-hue-api')
const ColorMapper = require('./ColorMapper')

const HueApi = hue.HueApi
const lightState = hue.lightState

const host = '172.16.4.1'
const username = '1jKNLVJMfXVnfAa16EBROviTmV-wfO1iF5thYW0N'
const api = new HueApi(host, username)

const displayError = (err) => {
  console.log(err);
}

function setLight (switchState='off', color='white', brightness=10) {
  let state

  if (switchState === 'off') {
    state = lightState
      .create()
      .off()
  } else {
    const colorRGB = ColorMapper.colourNameToRGB(color)
    state = lightState
      .create()
      .on()
      .brightness(brightness)
      .rgb(colorRGB.red, colorRGB.green, colorRGB.blue)
  }

  api.setLightState(2, state)
    .then((res) => console.log(`Changed state to ${switchState}, ${color}, ${brightness}`))
    .catch(displayError)
    .done();
}


module.exports = {
  setLight
}
