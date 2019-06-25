import { randomBytes } from 'crypto';

const Symbol_ASSIGNMENT = Symbol('assignment');
const Symbol_O_SUM = Symbol('sum');
const Symbol_O_MUL = Symbol('multiply');
const Symbol_O_REST = Symbol('minus');
const Symbol_O_DIV = Symbol('divide');
const Symbol_O_PERCENT = Symbol('percent');
// const Symbol_O_FUNCTION = Symbol('function');

const Symbol_O_PREF_O = Symbol('left_parenthesis (-'); // ?
const Symbol_O_PREF_C = Symbol('right_parenthesis )-'); // ?

const Symbol_O_NUMBER = Symbol('number');
const Symbol_O_CONST = Symbol('const');

const Operators = {
  [Symbol_ASSIGNMENT]: 1,
  [Symbol_O_SUM]: 2,
  [Symbol_O_REST]: 2,
  [Symbol_O_DIV]: 3,
  [Symbol_O_MUL]: 3,
  [Symbol_O_PERCENT]: 3,
  [Symbol_O_PREF_O]: 4, // ?
  [Symbol_O_PREF_C]: 4, // ?
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

class LexicalNode {
  type: keyof typeof Operators;

  forcePreference: boolean = false;

  uuid: string;

  lhs: LexicalNode | number | string | null = null;
  rhs: LexicalNode | number | string | null = null;

  constructor(sym: keyof typeof Operators) {
    this.type = sym;
    this.uuid = randomBytes(15).toString('hex');
  }

  static leftPreference({
    left,
    right,
    trueType,
  }: {
    left: LexicalNode;
    right: LexicalNode;
    trueType?: boolean;
  }) {
    if (Operators[left.type] === Operators[right.type]) return 0;

    if (!trueType) {
      // forcing preference with parenthesis
      if (left.forcePreference && !right.forcePreference) return 1;
      if (!left.forcePreference && right.forcePreference) return -1;
    }

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

class LexicalTree {
  input: string = '';

  indirectNodes = new Map<string, LexicalNode>();

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

      if (char === ' ') continue; //exit on empty space

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
          this.indirectNodes.set(rootNode.uuid, node);
        }
        rootNode = currentNode = node; // ? do we need an unfinished node as root?
        continue;
      }

      const compareNodes = LexicalNode.leftPreference({ left: node, right: currentNode });

      if (compareNodes > 0) {
        node.rhs = currentNode.lhs;
        currentNode.lhs = node;
        this.indirectNodes.set(node.uuid, currentNode);
        currentNode = node;
      } else if (compareNodes < 0) {
        const biggerOrEqual = this._findNextBiggerOrEqual(node, currentNode);
        const parentNode = this.indirectNodes.get(biggerOrEqual.uuid);

        node.rhs = biggerOrEqual;

        if (!parentNode) rootNode = node;
        else parentNode.lhs = node;

        this.indirectNodes.set(biggerOrEqual.uuid, node);
        this.indirectNodes.set(node.uuid, parentNode!);

        currentNode = node;
      } else {
        const biggerOrEqual = this._findNextBiggerOrEqual(node, currentNode);
        const parentNode = this.indirectNodes.get(biggerOrEqual.uuid);

        node.rhs = biggerOrEqual;

        if (!parentNode) rootNode = node;
        else parentNode.lhs = node;

        this.indirectNodes.set(biggerOrEqual.uuid, node);
        this.indirectNodes.set(node.uuid, parentNode!);

        currentNode = node;
      }
    }

    return rootNode;
  }

  private _findNextBiggerOrEqual(newNode: LexicalNode, currentNode: LexicalNode): LexicalNode {
    let exit = false;
    let operatingNode: LexicalNode;

    const trueType = LexicalNode.leftPreference({ left: newNode, right: currentNode, trueType: true });
    if (trueType > -1) return currentNode;

    while (!exit) {
      const parent = this.indirectNodes.get(currentNode.uuid);
      if (!parent) return currentNode;

      if (LexicalNode.leftPreference({ left: newNode, right: parent }) < 0)
        return this._findNextBiggerOrEqual(newNode, parent);
      exit = true;
      operatingNode = parent;
    }

    return operatingNode!;
  }
}

export { Interpreter };
