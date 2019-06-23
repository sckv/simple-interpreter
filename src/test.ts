import { Interpreter } from '@index';

const int = new Interpreter();
const input = 'x = 2 + 4';
const input2 = 'x = 2 + 4 + 3';

const input3 = 'x = 2 * 4';
const input4 = 'x = 2 * 4 + 3';

const input5 = 'x = 2 * (4 + 3)';
const input6 = 'x = 5 + 2 * (4 / (3 + 1))';

const input7 = 'x = 5 + 3 + 4 + 1';
const input8 = 'x = (5 + (3 + 4)) + 1';

const input9 = 'x = 6 * 7 * 1 + 5';
const input10 = 'x = 6 * (7 * 1) + 5';

const input11 = 'x = 5 + 2 * (4 / (3 + 1))';

const input12 = 'x = (2 + 3) / 4';

const tree = int.execute(input4);

console.log(tree!.rhs);
