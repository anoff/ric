const bodyParser = require('body-parser');
const express = require('express')
const HueService = require('./HueService')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const PORT = process.env.PORT || 3000

app.post('/', (req, res) => {
  const state = req.body.state
  const color = req.body.color
  const brightness = req.body.brightness

  HueService.setLight(state, color, brightness)

  res.send(`${state}, ${color}, ${brightness}`)
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
