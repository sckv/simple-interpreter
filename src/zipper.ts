import util from 'util';
// import { logAll } from '@index';

type NodeSide = 'left' | 'right';

type TreeNodeUnit<T = any> = {
  value: NodeData | null; // UID?
  left: T | null;
  right: T | null;
};

type Trail = [NodeSide, NodeData /* UID? */, Ztree | null];

type TrailArray = Trail[];

interface Ztree extends TreeNodeUnit<Ztree> {}

export type NodeData<V = string | number | symbol> = {
  type: symbol;
  value?: V;
};

export class ZGraph {
  private _trail: TrailArray;
  private _tree: Ztree;

  constructor(tree: Ztree = { left: null, value: null, right: null }, trail: TrailArray = []) {
    this._tree = tree;
    this._trail = trail;
  }

  toString() {
    console.log('Tree:: \n', util.inspect(this._tree, false, null, true), '\n');
    console.log('Trail:: \n', util.inspect(this._trail, false, null, true), '\n');
  }

  toTree() {
    return this._rebuildTree(this._tree, this._trail);
  }

  nodeValue() {
    return this._tree.value;
  }

  hasLeft() {
    return !!this._tree.left;
  }

  hasRight() {
    return !!this._tree.right;
  }

  hasTop() {
    return !!this._trail.length;
  }

  left() {
    if (!this._tree.left) return null;

    const trailerd = [['left', createNewObject(this._tree.value), createNewObject(this._tree.right)]].concat(
      this._trail,
    ) as TrailArray; // TS FAILS TO GET TYPE FROM INTERFACE Ztree

    return new ZGraph(createNewObject(this._tree.left)!, trailerd);
  }

  right() {
    if (!this._tree.right) return null;

    const trailerd = [['right', createNewObject(this._tree.value), createNewObject(this._tree.left)]].concat(
      this._trail,
    ) as TrailArray;

    return new ZGraph(createNewObject(this._tree.right)!, trailerd);
  }

  up() {
    if (this._trail.length === 0) return null;

    const last = this._trail[0];
    return new ZGraph(this._fromTrail(this._tree, last), this._trail.slice(1));
  }

  setValue(value: NodeData) {
    return new ZGraph({ value, left: this._tree.left, right: this._tree.right }, this._trail);
  }

  setLeft(value: NodeData) {
    return new ZGraph(
      { value: this._tree.value, left: this._newLeaf(value), right: this._tree.right },
      this._trail,
    );
  }

  setRight(value: NodeData) {
    return new ZGraph(
      { value: this._tree.value, left: this._tree.left, right: this._newLeaf(value) },
      this._trail,
    );
  }

  upsertRight(value: NodeData) {
    return new ZGraph({ value, right: createNewObject(this._tree), left: null }, this._trail);
  }

  upsertLeft(value: NodeData) {
    return new ZGraph({ value, left: createNewObject(this._tree), right: null }, this._trail);
  }

  insertRight(value: NodeData) {
    return new ZGraph(
      {
        value: createNewObject(this._tree.value),
        left: createNewObject(this._tree.left),
        right: { ...this._newLeaf(value), left: createNewObject(this._tree.right) },
      },
      this._trail,
    ).right()!;
  }

  insertLeft(value: NodeData) {
    return new ZGraph(
      {
        value: createNewObject(this._tree.value),
        right: createNewObject(this._tree.right),
        left: { ...this._newLeaf(value), right: createNewObject(this._tree.left) },
      },
      this._trail,
    ).left()!;
  }

  swapFlat() {
    const { value, right, left } = this._tree;
    return new ZGraph({ value, right: left, left: right }, this._trail);
  }

  private _newLeaf(value: NodeData): Ztree {
    return this._newNode(value, null, null);
  }

  private _newNode(value: NodeData, left: Ztree | null, right: Ztree | null): Ztree {
    return {
      value,
      left,
      right,
    };
  }

  private _fromTrail(tree: Ztree, last: Trail): Ztree {
    if (last[0] === 'left') {
      return {
        value: last[1],
        left: tree,
        right: last[2],
      };
    }
    return {
      value: last[1],
      left: last[2],
      right: tree,
    };
  }

  private _rebuildTree(tree: Ztree, trail: TrailArray): Ztree {
    if (trail.length === 0) return tree;

    const last = trail[0];
    return this._rebuildTree(this._fromTrail(tree, last), trail.slice(1));
  }
}

const createNewObject = <T = any>(obj: T): T | null => {
  if (obj) return Object.assign({}, obj);

  return null;
};
