import { Interpreter } from '@index';

const int = new Interpreter();
const input1 = 'x = 2 + 4';
const input2 = 'x = 2 + 4 + 3';

const input3 = 'x = 2 * 4';
const input4 = 'x = 2 * 4 + 3';

const input5 = 'x = 2 * (4 + 3)';
const input6 = 'x = 5 + 2 * (4 / (3 + 1))';

const input7 = 'x = 5 + 3 + 4 + 1';
const input8 = 'x = (5 + (3 + 4)) + 1';

const input9 = 'x = 6 * 7 * 1 + 5';
const input10 = 'x = 6 * (7 * 1) + 5';
const input11 = 'x = (6 * 7) * 1 + 5';

const input12 = 'x = 5 + 2 * (4 / (3 + 1))';

const input13 = 'x = 1 + (2 + 3) / 4'; //fail

console.log((int.execute(input1) as any).rhs);
console.log((int.execute(input2) as any).rhs);
console.log((int.execute(input3) as any).rhs);
console.log((int.execute(input4) as any).rhs);
console.log((int.execute(input5) as any).rhs);
console.log((int.execute(input6) as any).rhs);
console.log((int.execute(input7) as any).rhs);
console.log((int.execute(input8) as any).rhs);
console.log((int.execute(input9) as any).rhs);
console.log((int.execute(input10) as any).rhs);
console.log((int.execute(input11) as any).rhs);
console.log((int.execute(input12) as any).rhs);
console.log((int.execute(input13) as any).rhs);
