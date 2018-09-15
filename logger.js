"use strict";

var appRoot = require('app-root-path')
const winston = require('winston')
const config = require('./config.json')
const { format, createLogger, transports } = winston

// define the custom settings for each transport (file, console)
const options = {
	fileInfos: {
		name: 'info-log',
		filename: `${appRoot}/logs/${config.logName}`,
		level: 'debug',
		format: format.combine(
			format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
			format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
		),
		maxsize: 500*1000, // 500KB
		maxFiles: 2,
		tailable: true // The filename will always have the most recent log lines. The larger the appended number, the older the log file.
	},
	fileWarns: {
		name: 'warning-log',
		level: 'warn',
		format: format.combine(
			format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
			format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
		),
		filename: `${appRoot}/logs/${config.logErrorName}`,
		maxsize: 500*1000, // 500KB
		maxFiles: 2,
		tailable: true // The filename will always have the most recent log lines. The larger the appended number, the older the log file.
	},
	console: {
		format: format.combine(
			format.timestamp({
				format: 'YYYY-MM-DD HH:mm:ss'
			}),
			format.colorize(),
			format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
		),
		level: 'debug'
	}
}

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
	transports: [
		// new winston.transports.File(options.file),
		new transports.File(options.fileInfos),
		new transports.File(options.fileWarns),
		new transports.Console(options.console)
	]
})

module.exports = logger;
