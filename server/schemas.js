const mongoose = require('mongoose')

const GreenhouseStatSchema = new mongoose.Schema({
  ghId: {
    type: String,
    default: '0'
  },
  currentTemp: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

const TargetTempSchema = new mongoose.Schema({
  desiredTemp: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

const GreenhouseStat = mongoose.model('GreenhouseStat', GreenhouseStatSchema)
const TargetTemp = mongoose.model('TargetTemp', TargetTempSchema)

module.exports = { GreenhouseStat, TargetTemp }