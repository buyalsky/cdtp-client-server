#!/usr/bin/env node
const express = require('express')
const basicAuth = require('express-basic-auth')

const { GreenhouseStat, TargetTemp } = require('./schemas')
require('./bootstrap')

const username = process.env.CDTP_USERNAME || 'user'
const password = process.env.CDTP_PASSWORD || 'pass'

const app = express()

app.use(express.json())
app.use(basicAuth({
  challenge: true,
  users: {
    [username]: password
  },
  unauthorizedResponse: getUnauthorizedResponse
}))

function getUnauthorizedResponse(req) {
  return req.auth
    ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
    : 'No credentials provided'
}


app.get('/', async (req, res) => {
  const mostRecentData = await GreenhouseStat.findOne({}, {}, {
    sort: {date: -1}
  })
  res.send(mostRecentData)
})

app.get('/desired-temp', async (req, res) => {
  const mostRecentTargetTemp = await TargetTemp.findOne({}, {}, {
    sort: {date: -1}
  })
  res.send(mostRecentTargetTemp)
})

app.get('/all', async (req, res) => {
  const maxLimit = Number(req.query.limit)
  const temperatures = GreenhouseStat.find({}, {}, {
    sort: {date: -1}
  })
  if (maxLimit)
    res.send(await temperatures.limit(Number(maxLimit)))
  else
    res.send(await temperatures)
})

app.get('/desired-temp/all', async (req, res) => {
  const maxLimit = Number(req.query.limit)
  const targetTemps = TargetTemp.find({}, {}, {
    sort: {date: -1}
  })
  if (maxLimit)
    res.send(await targetTemps.limit(maxLimit))
  else
    res.send(await targetTemps)
})

app.post('/', async (req, res) => {
  const greenhouseStat = new GreenhouseStat({
    ghId: req.body.ghId,
    currentTemp: req.body.currentTemp,
    date: new Date(req.body.date)
  })
  await greenhouseStat.save()
  res.send(greenhouseStat)
})

app.post('/desired-temp', async (req, res) => {
  const targetTemp = new TargetTemp({
    desiredTemp: req.body.desiredTemp,
    date: new Date(req.body.date)
  })
  await targetTemp.save()
  res.send(targetTemp)
})

const server = app.listen(3000, () => {
  console.log('server listening')
})

process.on('uncaughtException', () => {
  if (server) server.close()
})

process.on('SIGTERM', () => {
  if (server) server.close()
})

