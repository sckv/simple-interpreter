export const Symbols = {
  ASSIGNMENT: Symbol('assignment'),
  O_SUM: Symbol('sum'),
  O_MUL: Symbol('multiply'),
  O_REST: Symbol('minus'),
  O_DIV: Symbol('divide'),
  O_PERCENT: Symbol('percent'),

  O_FUNCTION: Symbol('function'),
  O_FUNCTION_NAME: Symbol('function_name'),
  O_FUNCTION_ARROW: Symbol('function_arrow'),

  O_PREF_O: Symbol('left_parenthesis ( |'), // ?
  O_PREF_C: Symbol('right_parenthesis ) |'), // ?

  O_NUMBER: Symbol('number'),
  O_VARIABLE: Symbol('variable'),
};

export const OperatorsValue = {
  [Symbols.ASSIGNMENT]: 1,
  [Symbols.O_SUM]: 2,
  [Symbols.O_REST]: 2,
  [Symbols.O_DIV]: 3,
  [Symbols.O_MUL]: 3,
  [Symbols.O_PERCENT]: 3,
  [Symbols.O_PREF_O]: 4, // ?
  [Symbols.O_PREF_C]: 4, // ?
};

export const OperatorsMatcher: { [k: string]: symbol } = {
  '=': Symbols.ASSIGNMENT,
  '+': Symbols.O_SUM,
  '-': Symbols.O_REST,
  '*': Symbols.O_MUL,
  '/': Symbols.O_DIV,
  '%': Symbols.O_PERCENT,
  '(': Symbols.O_PREF_O,
  ')': Symbols.O_PREF_C,
  fn: Symbols.O_FUNCTION,
  '=>': Symbols.O_FUNCTION_ARROW,
};

export class Tokenizer {
  private _input = '';

  constructor(input: string) {
    this._input = input;
  }

  tokenize() {
    const tokenized: Array<{ type: symbol; value?: string | number }> = [];

    let isFn = false;

    const splitted = this._input.split(/ /gi);

    const inputLength = splitted.length;

    for (let i = 0; i < inputLength; i++) {
      const item = splitted[i];
      const decode = decodeChar(item);
      console.log('DECODED>>>', item, decode);
      switch (decode) {
        case Symbols.O_FUNCTION:
          isFn = true;
          tokenized.push({ type: decode });
          break;
        case Symbols.O_NUMBER:
          tokenized.push({ type: decode, value: +item });
          break;
        case Symbols.O_VARIABLE:
          tokenized.push({ type: isFn ? Symbols.O_FUNCTION_NAME : decode, value: item });
          isFn = false;
          break;
        default:
          tokenized.push({ type: decode });
      }
    }

    return tokenized;
  }
}

const decodeChar = (char: string) => {
  const operator = OperatorsMatcher[char];
  if (operator) return operator;
  if (isNumber(char)) return Symbols.O_NUMBER;
  return Symbols.O_VARIABLE;
};

const isNumber = (char: any) => !Number.isNaN(Number(char));
