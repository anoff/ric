/* global log */
const express = require('express')
const EventEmitter = require('events')
const app = express()
const emitter = new EventEmitter()
const port = 3030

let server
app.post('/start', function (req, res) {
  log.info('Received POST on /start')
  emitter.emit('start_game', '')
  res.send('NAGUT')
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
