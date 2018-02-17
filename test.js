var logger = require('winston');
var fs = require('fs');

test();

function test(){
	try {
		testError();
	} catch (e) {
		logger.info(JSON.stringify(e, null, 4));
	}
}


function testError() {
	throw {"asdf":123, "info":"rien"}
}
