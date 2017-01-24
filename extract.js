var babylon = require('babylon');

function run(inputCode){
  var ast = null;
  try{
    ast = extract(inputCode);
  }catch(e){
    console.error('Could not extract input');
  }

  return JSON.stringify(ast, null, 4);
}

//The purpose here is to try to clean up the input code if it doesn't parse
//This could mean anything from stripping off trailing brackets, to leading uncompleted if/for/while statements
function extract(inputCode){
  var ast = null;
  try{
    ast = babylon.parse(inputCode);
  }catch(e){}

  if(!ast){
    var firstParen = inputCode.indexOf('(');
    var lastParen = inputCode.lastIndexOf(')');
    if(firstParen >= 0 && lastParen >=0 && firstParen < lastParen){
      var betweenParenInput = balanceParens(inputCode.substring(firstParen, lastParen + 1).trim());
      try{
        ast = babylon.parse(betweenParenInput);
      }catch(e){
        console.error('Parse error ', e);
      }
    }
  }

  return ast;
}

//Check to see if there are an equal number of parens, and if not, add on enough at the beginning
//or end of the string to balance
function balanceParens(inputCode){
  var leftParens = (inputCode.match(/\(/g)||[]).length;
  var rightParens = (inputCode.match(/\)/g)||[]).length;

  if(leftParens > rightParens){
    inputCode = inputCode + Array(leftParens - rightParens + 1).join(")");
  }else if(rightParens > leftParens){
    inputCode = Array(rightParens - leftParens + 1).join("(") + inputCode;
  }

  return inputCode;
}

module.exports = {run: run, extract: extract};