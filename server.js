'use strict'
const db_conf = require('./conf/db')
const log4js_conf = require('./conf/log4js')
var log4js = require("log4js");
log4js.configure(log4js_conf);
