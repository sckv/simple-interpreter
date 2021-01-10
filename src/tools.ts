import { inspect } from 'util';
import { cloneDeep } from 'lodash';
import { OPERATORS, OperatorsMatcher, OperatorsValue } from './constants';

import { NodeData, Zipper } from './zipper';

export const decodeChar = (token: string) => {
  const operator = OperatorsMatcher[token];
  if (operator) return operator;
  if (isNumber(token) || isNumber(token)) return OPERATORS.LITERAL;
  return OPERATORS.IDENTIFIER;
};

export const isNumber = (token: any) => !Number.isNaN(Number(token));

export const createNewObject = <T = any>(obj: T): T | undefined => {
  if (obj) return cloneDeep(obj);

  return undefined;
};

export const leftPreference = ({ left, right }: { left?: NodeData; right?: NodeData }) => {
  if (!left) return false;
  if (!right) return true;
  const leftOp = OperatorsValue[left.type as any];
  const rightOp = OperatorsValue[right.type as any];
  return leftOp > rightOp;
};

// TODO: need rework
export const findUpperPreference = (graph: Zipper, node: NodeData): Zipper => {
  if (leftPreference({ left: graph.nodeValue()!, right: node })) {
    if (graph.hasTop()) return findUpperPreference(graph.up()!, node);
  }

  return graph;
};

export function logAll(...data: any[]) {
  console.log(inspect(data, false, null, true));
}
