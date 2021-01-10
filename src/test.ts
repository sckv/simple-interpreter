import { Parser } from './parser';
import { Zipper } from './zipper';

const int = new Parser();
// const input1 = 'x = 2 + 4';
// const input2 = 'x = 2 + 4 + 3';
const input16 = 'fn avg x y => 2 + 4 + 3';

// const input3 = 'x = 2 * 4';
// const input4 = 'x = 1 - 2 * 4 + 3';

// const input5 = 'x = 1 + 2 * (4 + 3)';
// const input6 = 'x = 5 + 2 * (4 / (3 + 1))';

// const input7 = 'x = 5 + 3 + 4 + 1';
// const input8 = 'x = (5 + (3 + 4)) + 1';

// const input9 = 'x = 6 * 7 * 1 + 5';
// const input10 = 'x = 6 * (7 * 1) + 5';
// const input11 = 'x = (6 * 7) * 1 + 5';

const input12 = `xala = 1 + (27 + 3) / 40
waka = 4`;

// const input13 = 'x = ((1 + 2) * 3 - 5) / 4'; // fail

// const input14 = 'x = (1 + (1 + 2) + 3) * 5';

// const input15 = 'x = (1 + (7 + 2 * 3)) * 5';

// int.execute(input1);
int.execute(input12);
// int.execute(input16);

//

// console.log((int.execute(input1) as any).rhs);
// console.log((int.execute(input2) as any).rhs);
// console.log((int.execute(input3) as any).rhs);
// console.log((int.execute(input4) as any).rhs);
// console.log((int.execute(input5) as any).rhs);
// console.log((int.execute(input6) as any).rhs.rhs);
// console.log((int.execute(input7) as any).rhs);
// console.log((int.execute(input8) as any).rhs);
// console.log((int.execute(input9) as any).rhs);
// console.log((int.execute(input10) as any).rhs);
// console.log((int.execute(input11) as any).rhs);
// console.log((int.execute(input12) as any).rhs);
// console.log((int.execute(input13) as any).rhs);
// console.log((int.execute(input14) as any).lhs);
// console.log((int.execute(input15) as any).rhs.lhs);
