function eval() {
  // Do not use eval!!!
  return;
}

function expressionCalculator(expr) {
  
  function readWhile(chars, predicate) {
    let str = "";

    while (chars.length && predicate(chars[0])) {
      str += chars.shift();
    }

    return str;
  }

  function isWhitespace(ch) {
    return /[\n\t\s]/.test(ch);
  }

  function isNum(ch) {
    return /[0-9.]/.test(ch);
  }

  function isOp(ch) {
    return /[()\-+\/*^%]/.test(ch);
  }

  function countElements(arr, str) {
    newArr = []

    arr.forEach(element => {
      if (element === str) {
        newArr.push(element)
      }
    })

    return newArr.length
  }

  function tokenize(input) {
    const chars = input.split("");
    
    const leftBracketsArray = countElements(chars, '(');
    const rigthBracketsArray = countElements(chars, ')');

    if (leftBracketsArray !== rigthBracketsArray) throw "ExpressionError: Brackets must be paired";

    const tokens = [];

    while (chars.length) {
      
      readWhile(chars, isWhitespace);

      if (!chars.length) {
        break;
      }

      const ch = chars.shift();

      if (isNum(ch)) {
        tokens.push({ type: "NUM", val: ch + readWhile(chars, isNum) });
      } else if (isOp(ch)) {
        tokens.push({ type: "OP", val: ch });
      } 
    }

    return tokens;
  }

  function infixToReversePolish(tokens) {
    const queue = [];
    const stack = [];
    const precedence = {
      "(": 10,
      "+": 20, "-": 20,
      "/": 30, "*": 30, "%": 30,
      "^": 40,
    };
  
    while (tokens.length) {
      const token = tokens.shift();
      const tkPrec = precedence[token.val] || 0;
      let stPrec = stack.length ? precedence[stack[stack.length - 1].val] : 0;
  
      if (token.type == "OP" && token.val == ")") {
        let op = null;
  
        while ((op = stack.pop()).val != "(") {
          queue.push(op);
        }
      } else if (token.type == "NUM") {
        queue.push(token);
      } else if (token.type == "OP" && (!stack.length || token.val == "(" || tkPrec > stPrec)) {
        stack.push(token);
      } else {
        while (tkPrec <= stPrec) {
          queue.push(stack.pop());
          stPrec = stack.length ? precedence[stack[stack.length - 1].val] : 0;
        }
  
        stack.push(token);
      }
    }
  
    while (stack.length) {
      queue.push(stack.pop());
    }
  
    return queue;
  }

  function evaluate(tokens) {
    const stack = [];
  
    while (tokens.length) {
      const token = tokens.shift();
  
      if (token.type == "NUM") {
        stack.push(parseFloat(token.val));
        continue;
      }

      const rhs = stack.pop();
      const lhs = stack.pop();
      
      switch (token.val) {
        case "+": 
          stack.push(lhs + rhs); break;
        case "-": 
          stack.push(lhs - rhs); break;
        case "*": 
          stack.push(lhs * rhs); break;
        case "/": 
          if(rhs !== 0) {stack.push(lhs / rhs); break} 
          else {throw "TypeError: Division by zero."};
        case "%": 
          stack.push(lhs % rhs); break;
        case "^": 
          stack.push(Math.pow(lhs, rhs)); break;
      }
    }
    return stack.pop();
  }

  const tokensArr = tokenize(expr); 
  
  const polishReverse = infixToReversePolish(tokensArr);

  return resultFunction = evaluate(polishReverse);
}

module.exports = {
  expressionCalculator
};
