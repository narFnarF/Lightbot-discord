var logger = require('winston');
var fs = require('fs');

test();

function test(){
	logger.info("Hello! This is a test.");
	logger.info("Hi Atest! I'm Dad!");
	testError();

}


function testError() {
	throw "error";
}
