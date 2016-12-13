var babylon = require('babylon');

var inputCode = process.argv[2];
var ast = babylon.parse(inputCode);
console.log(JSON.stringify(ast, null, 4));