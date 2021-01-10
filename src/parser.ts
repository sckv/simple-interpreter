import { NodeData, Zipper } from './zipper';
import { Lexer } from './lexer';
import { OPERATORS } from './constants';
import { logAll } from './tools';

export class Parser {
  private input = '';

  execute(input: string) {
    this.input = input;
    this.createAbstractSyntaxTree();
  }

  private createAbstractSyntaxTree() {
    let graph = new Zipper();
    const lexer = new Lexer(this.input);

    const tokens = lexer.tokenize();

    const preferenceStack: Zipper[] = [graph];

    while (tokens.length) {
      const token = tokens.shift()!;
      let tmpGraph = preferenceStack.pop()!;

      const resultGraph = this.classify(token, tmpGraph, preferenceStack.pop());

      resultGraph.forEach(rg => preferenceStack.push(rg));
    }

    preferenceStack[0].rebuildAndShow();
  }

  private classify(token: NodeData, graph: Zipper, previous?: Zipper): Zipper[] {
    switch (token.type) {
      case OPERATORS.ASSIGNMENT:
        while (graph.hasTop()) {
          graph = graph.up()!;
        }
        graph = graph.setValue(token);

        return previous ? [previous, graph] : [graph];

      case OPERATORS.IDENTIFIER:
      case OPERATORS.LITERAL:
        if (!graph.hasLeft()) graph = graph.setLeft(token);
        else if (!graph.hasRight()) graph = graph.setRight(token);
        else graph = graph.insertLeft(token);
        return previous ? [previous, graph] : [graph];

      case OPERATORS.DIV:
      case OPERATORS.MUL:
        graph = graph.insertLeft(token);
        // graph.toString('GRAPH');
        return previous ? [previous, graph] : [graph];

      case OPERATORS.SUM:
      case OPERATORS.REST:
        if (!graph.nodeValue()) graph = graph.setValue(token);
        else if (!graph.hasLeft()) graph = graph.setLeft(token);
        else if (!graph.hasRight()) graph = graph.setRight(token);
        else graph = graph.insertRight(token);
        return previous ? [previous, graph] : [graph];

      case OPERATORS.PREF_OPEN:
        const newGraph = new Zipper();
        graph = graph.swapFlat();
        return previous ? [previous, graph, newGraph] : [graph, newGraph];

      case OPERATORS.PREF_CLOSE:
        while (graph.hasTop()) {
          graph = graph.up()!;
        }
        previous = previous?.setLeft(graph)!;
        return [previous];

      default:
        throw `Token ${String(token.type)} not implemented`;
    }
  }
}
