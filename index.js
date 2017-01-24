var extract = require('./extract.js');

var inputCode = process.argv[2];
console.log(extract.run(inputCode));