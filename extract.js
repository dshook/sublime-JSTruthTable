var babylon = require('babylon');

function run(inputCode){
  var ast = null;
  try{
    ast = extract(inputCode);

    if(!ast) return null;

    ast = findAstRoot(ast);
    return JSON.stringify(ast, null, 4);
  }catch(e){
    console.error('Could not extract input');
  }

  return null;
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

//This takes the ast and traverses it to find the logical/binary expression node to use as the root node
//for further operations
function findAstRoot(ast){
  var acceptableRoots = ['LogicalExpression', 'BinaryExpression', 'UnaryExpression'];
  if(!ast || acceptableRoots.includes(ast.type)){
    return ast;
  }

  var nextNode = null;
  switch(ast.type){
    case 'File':
      nextNode = ast.program;
      break;
    case 'Program':
      nextNode = ast.body[0];
      break;
    case 'ExpressionStatement':
      nextNode = ast.expression;
      break;
    case 'WhileStatement':
    case 'ForStatement':
    case 'IfStatement':
    case 'ConditionalExpression':
      nextNode = ast.test;
      break;
    case 'AssignmentExpression':
      nextNode = ast.right;
      break;
    case 'VariableDeclaration':
      nextNode = ast.declarations[0];
      break;
    case 'VariableDeclarator':
      nextNode = ast.init;
      break;
    default:
      console.error("Don't know how to proceed with node " + ast.type);
  }

  if(nextNode){
    return findAstRoot(nextNode);
  }
  return null;
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

module.exports = {run: run, extract: extract, findAstRoot: findAstRoot};