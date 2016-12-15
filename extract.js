var babylon = require('babylon');

module.exports = function extract(inputCode){
  try{
    var ast = babylon.parse(inputCode);
  }catch(e){
    console.error('Could not parse input');
  }
  return JSON.stringify(ast, null, 4);
}