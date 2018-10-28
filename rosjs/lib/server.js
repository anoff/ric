/* global log */
const express = require('express')
const EventEmitter = require('events')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
const emitter = new EventEmitter()
const port = 3030

let server
app.post('/start', function (req, res) {
  log.debug('Received POST on /start')
  emitter.emit('start_game', '')
  res.send('NAGUT')
})

app.post('/safetynet', function (req, res) {
  log.debug('Received POST on /safetynet', req.body)
  emitter.emit('safety_net', req.body)
  res.send('DANKE')
})

function start () {
  server = app.listen(port, function () {
    log.info(`http://localhost:${port}`)
  })
}

module.exports = {
  start,
  emitter
}
