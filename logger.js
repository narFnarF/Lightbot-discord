"use strict";

var appRoot = require('app-root-path')
var winston = require('winston')
var config = require('./config.json')


// define the custom settings for each transport (file, console)
var options = {
	fileInfos: {
		name: 'info-log',
		filename: `${appRoot}/logs/${config.logName}`,
		level: 'debug',
		timestamp: function () {
			return Date();
		},
		maxsize: 500*1000, // 500KB
		maxFiles: 2,
		tailable: true, // The filename will always have the most recent log lines. The larger the appended number, the older the log file.
		json: false
	},
	fileWarns: {
		name: 'warning-log',
		filename: `${appRoot}/logs/${config.logErrorName}`,
		level: 'warn',
		timestamp: function () {
			return Date();
		},
		maxsize: 500*1000, // 500KB
		maxFiles: 2,
		tailable: true, // The filename will always have the most recent log lines. The larger the appended number, the older the log file.
		json: false
	},
	console: {
		colorize: true,
		level: 'debug',
		timestamp: function () {
			return Date();
		},
		// handleExceptions: true,
		json: false
	}
}

// var options = {
//   file: {
//     level: 'info',
//     filename: `${appRoot}/logs/app.log`,
//     handleExceptions: true,
//     json: true,
//     maxsize: 5242880, // 5MB
//     maxFiles: 5,
//     colorize: false,
//   },
//   console: {
//     level: 'debug',
//     handleExceptions: true,
//     json: false,
//     colorize: true,
//   },
// }


// instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
	transports: [
		new winston.transports.File(options.file),
		// new winston.transports.File(options.fileInfos),
		// new winston.transports.File(options.fileWarns),
		new winston.transports.Console(options.console)
	],
	exitOnError: false, //do not exit on handled exceptions
})





// function initializeWinstonLogger(logger) {
// 	// Configure logger settings
// 	logger.remove(logger.transports.Console);
// 	logger.add(logger.transports.Console, {
// 		colorize: true,
// 		level: 'debug',
// 		timestamp: function () {
// 			return Date();
// 		}
// 	});
//
// 	logger.add(logger.transports.File, {
// 		name: 'info-log',
// 		filename: config.logPath,
// 		level: 'debug',
// 		timestamp: function () {
// 			return Date();
// 		},
// 		maxsize: 500*1000, // 500KB
// 		maxFiles: 2,
// 		tailable: true, // The filename will always have the most recent log lines. The larger the appended number, the older the log file.
// 		json: false
// 	});
//
// 	logger.add(logger.transports.File, {
// 		name: 'warning-log',
// 		filename: config.logErrorPath,
// 		level: 'warn',
// 		timestamp: function () {
// 			return Date();
// 		},
// 		maxsize: 500*1000, // 500KB
// 		maxFiles: 2,
// 		tailable: true, // The filename will always have the most recent log lines. The larger the appended number, the older the log file.
// 		json: false
// 	});
// }

module.exports = logger;
