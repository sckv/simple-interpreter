export const OPERATORS = {
  ASSIGNMENT: Symbol('assignment'),
  SUM: Symbol('sum'),
  MUL: Symbol('multiply'),
  REST: Symbol('minus'),
  DIV: Symbol('divide'),
  PERCENT: Symbol('percent'),

  FUNCTION: Symbol('function'),
  FUNCTION_NAME: Symbol('function_name'),
  FUNCTION_ARROW: Symbol('function_arrow'),

  PREF_OPEN: Symbol('left_parenthesis'), // ?
  PREF_CLOSE: Symbol('right_parenthesis'), // ?

  LITERAL: Symbol('literal'),
  IDENTIFIER: Symbol('identifier'),
};

export const OperatorsValue = {
  [OPERATORS.ASSIGNMENT]: 1,
  [OPERATORS.SUM]: 2,
  [OPERATORS.REST]: 2,
  [OPERATORS.DIV]: 3,
  [OPERATORS.MUL]: 3,
  [OPERATORS.PERCENT]: 3,
  [OPERATORS.PREF_OPEN]: 4, // ?
  [OPERATORS.PREF_CLOSE]: 4, // ?
} as const;

export const OPERATOR_TOKENS = {
  [OPERATORS.ASSIGNMENT]: '_$',
  [OPERATORS.LITERAL]: '$',
  [OPERATORS.SUM]: '',
  [OPERATORS.REST]: 2,
  [OPERATORS.DIV]: 3,
  [OPERATORS.MUL]: 3,
  [OPERATORS.PERCENT]: 3,
  [OPERATORS.PREF_OPEN]: 4, // ?
  [OPERATORS.PREF_CLOSE]: 4, // ?
} as const;

export const OperatorsMatcher: { [k: string]: symbol } = {
  '=': OPERATORS.ASSIGNMENT,
  '+': OPERATORS.SUM,
  '-': OPERATORS.REST,
  '*': OPERATORS.MUL,
  '/': OPERATORS.DIV,
  '%': OPERATORS.PERCENT,
  '(': OPERATORS.PREF_OPEN,
  ')': OPERATORS.PREF_CLOSE,
  fn: OPERATORS.FUNCTION,
  '=>': OPERATORS.FUNCTION_ARROW,
};
