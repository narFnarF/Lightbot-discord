"use strict";

class Logger {
	// config = require('./config.json') // I don't need those line if the constructor have the useWinston variable.
	// useWinston = config.useWinston


	constructor(useWinston) {
		this.useWinston = useWinston
		if (this.useWinston) {
			this.winston = require('winston')
		}
	}

	// get useWinston() {
	// 	return this.useWinston
	// }



	info(txt) {
		this.writeOutput("info", txt)
	}

	debug(txt) {
		this.writeOutput("debug", txt)
	}

	warn(txt) {
		this.writeOutput("warn", txt)
	}

	writeOutput(type, txt) {
		if (this.useWinston) {
			this.winston.log(type, txt)
		} else {
			if (type == "warn") {
				console.warn(txt)
			} else {
				console.log(txt)
			}
		}
	}
}
module.exports = Logger
