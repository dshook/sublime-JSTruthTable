var babylon = require('babylon');

function run(inputCode){
  try{
    var extracted = extract(inputCode);

    if(!extracted) return null;

    extracted.ast = findAstRoot(extracted.ast);
    var evaluated = evaluate(extracted.ast);
    return JSON.stringify(evaluated, null, 4);
  }catch(e){
    console.error('Could not extract input');
  }

  return null;
}

//The purpose here is to try to clean up the input code if it doesn't parse
//This could mean anything from stripping off trailing brackets, to removing leading incomplete if/for/while statements
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
        inputCode = betweenParenInput;
      }catch(e){
        console.error('Parse error ', e);
      }
    }
  }

  return {ast: ast, text: inputCode};
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

//Given one of the roots of an expression, evaluate all the possibilities, returning something like this:
// {
//   evaluations: [
//     {
//       subExpressionValues: [
//         {text: 'x', value: true},
//         {text: 'y', value: false}
//       ],
//       expressionResult: false
//     }
//   ]
// }
function evaluate(ast){
  if(ast.type === 'LogicalExpression'){

  }
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