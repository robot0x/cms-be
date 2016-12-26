'use strict'
const db_config = require('./config/db')
const log4js_config = require('./config/log4js')
var log4js = require('log4js')

log4js.configure(log4js_config)
