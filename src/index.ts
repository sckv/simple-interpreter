const Symbol_ASSIGNMENT = Symbol('assignment');
const Symbol_O_SUM = Symbol('sum');
const Symbol_O_MUL = Symbol('multiply');
const Symbol_O_REST = Symbol('minus');
const Symbol_O_DIV = Symbol('divide');
const Symbol_O_PERCENT = Symbol('percent');

const Symbol_O_PREF_O = Symbol('< left_parenthesis ( >'); // ?
const Symbol_O_PREF_C = Symbol('< right_parenthesis ) >'); // ?

const Symbol_O_NUMBER = Symbol('number');
const Symbol_O_CONST = Symbol('const');

const Operators = {
  [Symbol_ASSIGNMENT]: 1,
  [Symbol_O_SUM]: 2,
  [Symbol_O_REST]: 2,
  [Symbol_O_DIV]: 3,
  [Symbol_O_MUL]: 4,
  [Symbol_O_PERCENT]: 4,
  [Symbol_O_PREF_O]: 5, // ?
  [Symbol_O_PREF_C]: 5, // ?
};

const OperatorsMatcher: { [k: string]: symbol } = {
  '=': Symbol_ASSIGNMENT,
  '+': Symbol_O_SUM,
  '-': Symbol_O_REST,
  '*': Symbol_O_MUL,
  '/': Symbol_O_DIV,
  '%': Symbol_O_PERCENT,
  '(': Symbol_O_PREF_O,
  ')': Symbol_O_PREF_C,
};

class LexicalNode {
  type: keyof typeof Operators;

  forcePreference: boolean = false;

  lhs: LexicalNode | number | string | null = null;
  rhs: LexicalNode | number | string | null = null;

  constructor(sym: keyof typeof Operators) {
    this.type = sym;
  }

  static leftPreference(left: LexicalNode, right: LexicalNode) {
    if (Operators[left.type] === Operators[right.type]) return 0;
    // forcing preference with parenthesis
    if (left.forcePreference && !right.forcePreference) return 1;
    if (!left.forcePreference && right.forcePreference) return -1;

    if (Operators[left.type] > Operators[right.type]) return 1;
    if (Operators[left.type] < Operators[right.type]) return -1;
    return 0;
  }

  static decodeChar(char: string) {
    if (OperatorsMatcher[char]) return OperatorsMatcher[char];
    if (!Number.isNaN(Number(char))) return Symbol_O_NUMBER;
    return Symbol_O_CONST;
  }
}

class Interpreter {
  private _input: string = '';
  private _tree: LexicalNode | null = null;

  constructor() {}

  execute(input: string) {
    this._input = input; //.replace(/ /gi, '');
    this._createLexicalTree();
    return this._tree;
  }

  private _createLexicalTree() {
    const analyze = new LexicalTree(this._input);
    this._tree = analyze.result;
  }
}

class LexicalTree {
  input: string = '';
  constructor(input: string) {
    console.log('creating lexical tree', input);

    this.input = input;
  }

  get result() {
    let rootNode: LexicalNode | null = null;
    let currentNode: LexicalNode | null = null;
    let charCache: string | null = null;

    let preferenceStack = 0;

    const inputLength = this.input.length - 1;

    for (let i = inputLength; i >= 0; i--) {
      const char = this.input[i];

      if (char === ' ') continue;
      if (i === 0 && preferenceStack)
        throw new Error(`Error in the syntaxis. \nParenthesis never opens but it has a closing symbol.\n`);

      const decode = LexicalNode.decodeChar(char);

      if (decode === Symbol_O_NUMBER || decode === Symbol_O_CONST) {
        charCache = charCache !== null ? `${char}${charCache}` : char;
        if (i === 0 && currentNode) currentNode.lhs = charCache;
        continue;
      }

      if (decode === Symbol_O_PREF_C) {
        preferenceStack++;
        continue;
      }

      // we know aready that new char is an operator => flush charCache
      if (currentNode && charCache) {
        currentNode.lhs = charCache; // ?
        charCache = null; // ?
      }

      if (decode === Symbol_O_PREF_O) {
        if (preferenceStack === 0)
          throw new Error(`Error in the syntaxis pos. ${i + 1} \nParenthesis are still open.\n`);
        preferenceStack--;

        if (currentNode) currentNode.forcePreference = true;
        continue;
      }

      const node = new LexicalNode(decode as keyof typeof Operators);

      if (currentNode === null) {
        if (rootNode === null) {
          if (!charCache)
            throw new Error(`Error in the syntaxis pos. ${i + 1} \n.No value for operation available.\n`);
          node.rhs = charCache;
          charCache = null;
        } else {
          node.rhs = rootNode;
        }
        rootNode = currentNode = node; // ? do we need an unfinished node as root?
        continue;
      }

      const compareNodes = LexicalNode.leftPreference(node, currentNode);

      if (compareNodes > 0) {
        const saveLhs = currentNode.lhs;

        node.rhs = saveLhs;
        currentNode.lhs = node;

        rootNode = currentNode;

        currentNode = node;
      } else if (compareNodes < 0) {
        node.rhs = currentNode;
        currentNode = node;
        rootNode = currentNode;
      } else {
        const saveRhs = currentNode.rhs;

        node.rhs = saveRhs;
        currentNode.rhs = node;
        currentNode = node;
      }
    }

    return rootNode;
  }
}

export { Interpreter };
