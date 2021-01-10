import util from 'util';
import { createNewObject } from './tools';

type NodeSide = 'left' | 'right';

export type TreeNodeUnit<T = ZipperTree> = {
  value?: NodeData; // UID?
  left?: T;
  right?: T;
};

export type Trail = [NodeSide, NodeData /* UID? */, ZipperTree | undefined];

export type TrailArray = Trail[];

interface ZipperTree extends TreeNodeUnit<ZipperTree> {}

export type NodeData<V = string | number | symbol> = {
  type: symbol;
  value?: V;
};

export class Zipper {
  private _trail: TrailArray;
  private _tree: ZipperTree;

  constructor(tree: ZipperTree = {}, trail: TrailArray = []) {
    this._tree = tree;
    this._trail = trail;
  }

  rebuildAndShow() {
    let self = this as Zipper;
    while (self.hasTop()) {
      self = self.up()!;
    }
    self.toString();
  }

  toString(name?: string) {
    console.log(`Tree ${name}:: \n`, util.inspect(this._tree, false, null, true), '\n');
    console.log(`Trail ${name}:: \n`, util.inspect(this._trail, false, null, true), '\n');
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

    const trailerd = [
      ['left', createNewObject(this._tree.value), createNewObject(this._tree.right)] as Trail,
    ].concat(this._trail);

    return new Zipper(createNewObject(this._tree.left)!, trailerd);
  }

  right() {
    if (!this._tree.right) return null;

    const trailerd = [
      ['right', createNewObject(this._tree.value), createNewObject(this._tree.left)] as Trail,
    ].concat(this._trail);

    return new Zipper(createNewObject(this._tree.right)!, trailerd);
  }

  up() {
    if (this._trail.length === 0) return null;

    const last = this._trail[0];
    return new Zipper(this._fromTrail(this._tree, last), this._trail.slice(1));
  }

  setValue(value: NodeData) {
    return new Zipper({ value, left: this._tree.left, right: this._tree.right }, this._trail);
  }

  setLeft(value: NodeData | Zipper) {
    let fromZipper = null;
    if (value instanceof Zipper) {
      fromZipper = value.toTree();
    }
    return new Zipper(
      {
        value: this._tree.value,
        left: fromZipper ? fromZipper : this._newLeaf(value as NodeData),
        right: this._tree.right,
      },
      this._trail,
    );
  }

  setRight(value: NodeData | Zipper) {
    let fromZipper = null;
    if (value instanceof Zipper) {
      fromZipper = value.toTree();
    }
    return new Zipper(
      {
        value: this._tree.value,
        left: this._tree.left,
        right: fromZipper ? fromZipper : this._newLeaf(value as NodeData),
      },
      this._trail,
    );
  }

  upsertRight(value: NodeData) {
    return new Zipper({ value, right: createNewObject(this._tree) }, this._trail);
  }

  upsertLeft(value: NodeData) {
    return new Zipper({ value, left: createNewObject(this._tree) }, this._trail);
  }

  insertRight(value: NodeData) {
    return new Zipper(
      {
        value: createNewObject(this._tree.value),
        left: createNewObject(this._tree.left),
        right: { ...this._newLeaf(value), left: createNewObject(this._tree.right) },
      },
      this._trail,
    ).right()!;
  }

  insertLeft(value: NodeData) {
    return new Zipper(
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
    return new Zipper({ value, right: left, left: right }, this._trail);
  }

  private _newLeaf(value: NodeData): ZipperTree {
    return this._newNode(value);
  }

  private _newNode(value: NodeData, left?: ZipperTree, right?: ZipperTree): ZipperTree {
    const obj = {} as ZipperTree;
    if (value) Object.assign(obj, { value });
    if (left) Object.assign(obj, { left });
    if (right) Object.assign(obj, { right });
    return obj;
    // return {
    //   value,
    //   left,
    //   right,
    // };
  }

  private _fromTrail(tree: ZipperTree, last: Trail): ZipperTree {
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

  private _rebuildTree(tree: ZipperTree, trail: TrailArray): ZipperTree {
    if (trail.length === 0) return tree;

    const last = trail[0];
    return this._rebuildTree(this._fromTrail(tree, last), trail.slice(1));
  }
}
