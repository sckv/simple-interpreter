import util from 'util';

import { ZGraph, NodeData } from '@zipper';
import { Tokenizer, Symbols, OperatorsValue } from '@tokenizer';

class Interpreter {
  private _input: string = '';

  constructor() {}

  execute(input: string) {
    this._input = input.replace(/\)/gi, ' )').replace(/\(/gi, '( ');
    this._createLexicalTree();
  }

  private _createLexicalTree() {
    let graph = new ZGraph();
    const tokenizer = new Tokenizer(this._input);

    const tokens = tokenizer.tokenize();

    console.log(tokens);

    let preferenceStack = 0;

    let preferenceConsumed = 0;

    const inputLength = tokens.length - 1;

    for (let i = inputLength; i >= 0; i--) {
      const token = tokens[i];

      console.log('TOKEN>>', token);
      graph.toString();

      const { type } = token;

      if (type === Symbols.O_PREF_C) {
        preferenceStack++;
        preferenceConsumed++;
        continue;
      }

      if (type === Symbols.O_PREF_O) {
        preferenceStack--;
        continue;
      }

      if (type === Symbols.O_NUMBER || type === Symbols.O_VARIABLE) {
        if (!graph.hasRight()) graph = graph.setRight(token);
        else if (!graph.hasLeft()) graph = graph.setLeft(token);
        continue;
      }

      let preference = leftPreference({ left: graph.nodeValue()!, right: token });

      if (preferenceStack > 0 && preferenceConsumed === preferenceStack) {
        preferenceConsumed--;
        preference = true;
      }
      if (preference) graph = findUpperPreference(graph, token);

      console.log('PREFERENCE', preference);

      if (!graph.nodeValue()) {
        graph = graph.setValue(token);
        continue;
      }

      if (!preference) {
        graph = graph.insertLeft(token);
        continue;
      }

      graph = graph.upsertRight(token);
    }
    logAll(graph.toTree());
  }
}

export { Interpreter };

const leftPreference = ({ left, right }: { left?: NodeData; right?: NodeData }) => {
  if (!left) return false;
  if (!right) return true;
  const leftOp = OperatorsValue[left.type as any];
  const rightOp = OperatorsValue[right.type as any];
  return leftOp > rightOp;
};

// TODO: need rework
const findUpperPreference = (graph: ZGraph, node: NodeData): ZGraph => {
  if (leftPreference({ left: graph.nodeValue()!, right: node })) {
    if (graph.hasTop()) return findUpperPreference(graph.up()!, node);
  }

  return graph;
};

export function logAll(...data: any[]) {
  console.log(util.inspect(data, false, null, true));
}
