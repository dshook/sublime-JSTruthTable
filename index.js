var extract = require('./extract.js');

var inputCode = process.argv[2];

//shims
Array.prototype.includes = Array.prototype.includes || includes;

function includes(searchElement) {
  let length = this.length;
  if (length === 0) {
    return false;
  }
  var k = 0;
  while (k < length) {
    if (searchElement === this[k]) {
      return true;
    }
    k += 1;
  }
  return false;
}
//end of shim

console.log(extract.run(inputCode));