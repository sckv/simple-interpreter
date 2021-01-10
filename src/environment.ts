export class Environment {
  constructor(private env: { [k: string]: any } = {}) {}

  define(name: string, value: any) {
    this.env[name] = value;
    return value;
  }

  lookup(name: string) {
    if (!(name in this.env)) {
      throw ReferenceError(`Variable ${name} is not defined`);
    }
  }
}
