var logger = require('winston');
var fs = require('fs');

test();

function test(){
	logger.info("Hello! This is test.");
	testError();

}


function testError() {
	throw "error";
}
