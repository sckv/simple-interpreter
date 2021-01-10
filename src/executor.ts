import { OPERATORS } from './constants';
import { Environment } from './environment';
import { TreeNodeUnit } from './zipper';

export class Executor {
  constructor(private global = new Environment()) {}

  public eval(node?: TreeNodeUnit): any {
    if (!node) throw 'Empty node';

    const { left, right, value } = node;
    if (!left && !right) return value?.value;
    switch (value?.type) {
      case OPERATORS.SUM:
        return this.eval(left!) + this.eval(right!);
      case OPERATORS.REST:
        return this.eval(left!) - this.eval(right!);
      case OPERATORS.MUL:
        return this.eval(left!) * this.eval(right!);
      case OPERATORS.DIV:
        return this.eval(left!) / this.eval(right!);
      default:
        throw `Unexpected node: ${JSON.stringify(node)}`;
    }
  }
}
