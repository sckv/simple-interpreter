import { OPERATORS } from './constants';
import { isNumber } from './tools';
import { NodeData } from './zipper';

export class Lexer {
  constructor(private input: string = '') {}

  tokenize(): NodeData[] {
    const stripped = this.input.replace(/ /gi, '');
    const lines = this.getLines(stripped);

    const lanes = lines.map(line => {
      const localTokens: Map<string, { type: symbol; value?: string | number }> = new Map();
      let counter = 1;
      const tokenizedLine = line
        .replace(/("\w+"|\d+)/g, data => {
          const name = `$${counter}`;
          const format = isNumber(data) ? +data : data.slice(1, -1);
          localTokens.set(name, { type: OPERATORS.LITERAL, value: format });
          counter++;
          return name + '~';
        })
        .replace(/([_?a-zA-Z]+)/g, data => {
          const name = `$${counter}`;
          localTokens.set(name, { type: OPERATORS.IDENTIFIER, value: data });
          counter++;
          return name + '~';
        })
        .replace(/(\+)/g, () => {
          const name = `$${counter}`;
          localTokens.set(name, { type: OPERATORS.SUM });
          counter++;
          return name + '~';
        })
        .replace(/(\-)/g, () => {
          const name = `$${counter}`;
          localTokens.set(name, { type: OPERATORS.REST });
          counter++;
          return name + '~';
        })
        .replace(/(\/)/g, () => {
          const name = `$${counter}`;
          localTokens.set(name, { type: OPERATORS.DIV });
          counter++;
          return name + '~';
        })
        .replace(/(\*)/g, () => {
          const name = `$${counter}`;
          localTokens.set(name, { type: OPERATORS.MUL });
          counter++;
          return name + '~';
        })
        .replace(/(\=)/g, () => {
          const name = `$${counter}`;
          localTokens.set(name, { type: OPERATORS.ASSIGNMENT });
          counter++;
          return name + '~';
        })
        .replace(/(\()/g, () => {
          const name = `$${counter}`;
          localTokens.set(name, { type: OPERATORS.PREF_OPEN });
          counter++;
          return name + '~';
        })
        .replace(/(\))/g, () => {
          const name = `$${counter}`;
          localTokens.set(name, { type: OPERATORS.PREF_CLOSE });
          counter++;
          return name + '~';
        })
        .split(/~/gi)
        .filter(Boolean);

      return tokenizedLine.map(token => localTokens.get(token)!);
    });

    return lanes[0];
  }

  getLines(text: string) {
    return text.split('\n');
  }
}
