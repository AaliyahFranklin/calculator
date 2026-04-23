
const display = document.getElementById("display");

function appendToDisplay(input)
{
    display.value += input;
}
function clearDisplay()
{
    display.value ="";
}

//function since js doesnt have structs :(
function newToken(value, isNumber) {
    return { value, isNumber };
}

//compares precedence of top operator and the current one
function precedence(operator)
{
  if(operator == "^") return 3;
  if(operator == "*" || operator == "/") return 2;
  if(operator == "+"|| operator == "/") return 1;
  return 0; //non-operators
}

//custom digit check
function isDigit(ch) {
    return ch >= '0' && ch <= '9';
}

function tokenize(expression, count)
{
  let tokens = [];
  let current="";
  for(i=0; i< count;i++)
  {
    //implicit multiplication
    if(isDigit(expression[i]) && expression[i+1] == '(')
    {
      //push number first
      //then insert an explicit * token
      let multiply = newToken("*", false);
      tokens.push(multiply);
    }
    if(isDigit(expression[i]))
    {
      current += expression[i];
    }
    //check if number is a negative 
    else if (expression[i] == '-' && (i == 0 || !isDigit(expression[i-1])) && isDigit(expression[i+1]))
    {
     current += expression[i];
    }
    //check if decimal
    else if(expression[i]== '.')
    {
      current+= expression[i];
    }
    else //just finsihed reading a number, so push it
    {
      if(current != "")
      {
        let number = newToken(current,true);
        tokens.push(number);
        current = ""; //reset current
      }
      //now handle operator
      let operator = newToken(String(expression[i]), false);
      tokens.push(operator);
    }
    
  }
    
  //pushes number at the end of expression
  if(current != "")
  {
    let number = newToken(current, true);
    tokens.push(number);

  }
  return tokens;
}

function shuntingYard(tokens, tokenCount)
{
  let operatorStack =[]; //stack
  let outputQueue =[]; //queue
  let token;
  //while there are tokens to be read
  for(i=0;i<tokenCount;i++)
  {
    token = tokens[i];

    if(token.isNumber == true)
    {
      outputQueue.push(token);
    }
    else if(token.value == "(")
    {
      operatorStack.push(token);
    }
    else if(token.value == ")")
    {
      while(operatorStack.at(-1).value != "(")
      {
        outputQueue.push(operatorStack.pop()); //pop also returns the value in js
      }
      operatorStack.pop(); //remove '(' after
    }
    else //must be an operator
    {
      //check precedence of top operator
      while(operatorStack.length != 0 && precedence(operatorStack.at(-1).value) >= precedence(token.value))
      {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    }
  }
  while(operatorStack.length != 0)
  {
    outputQueue.push(operatorStack.pop());
  }

  return outputQueue;
}


function calculate(rpnExpression)
{
  let answer =[]; //stack
  let temp;
 
  let rpnLength = rpnExpression.length;
  

  for(i=0;i<rpnLength;i++)
  {
    
    if(rpnExpression.at(0).isNumber == true)
    {
     answer.push(Number(rpnExpression.shift().value));
    }
    else
    {
      let operation = rpnExpression.shift().value;
      let rightOperand = answer.pop();
      let leftOperand = answer.pop();
    

      if(operation == "^")
      {
        temp = leftOperand**rightOperand;
      }
      else if(operation == "*")
      {
        temp = leftOperand*rightOperand;
      }
      else if(operation == "/")
      {
        if(rightOperand == 0)
        {
          throw Error("Cannot divide by zero")
        }
        temp = leftOperand/rightOperand;
      }
      else if(operation == "+")
      {
        temp = leftOperand + rightOperand;
      }
      else if(operation == "-")
      {
        temp = leftOperand-rightOperand;
      }
      answer.push(temp);//push new value
      
    }
  }
  return answer.at(0); //the top value should be the answer
}

/* function displayAnswer()
{
  let count = display.value.length;
  
    let tokens = tokenize(display.value, count);
    let tokenCount = tokens.length;
    let rpnExpression = shuntingYard(tokens, tokenCount);
    display.value = calculate(rpnExpression);
  
 
}

 */
function displayAnswer()
{
  let expressionLength = display.value.length; //length of inputted expression
  let tokens = tokenize(display.value, expressionLength); //array
  console.log("tokens:", tokens);
  
  let tokenCount = tokens.length;
  let rpnExpression = shuntingYard(tokens, tokenCount);
  console.log("rpn:", rpnExpression);
  try
  {
    let result = calculate(rpnExpression);
    display.value = result;
    console.log("result:", result);
  }
  catch(Error)
  {
    display.value = "Error";
    
  }

  
}
