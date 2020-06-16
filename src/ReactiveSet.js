export class ReactiveSet extends Set {

  onChange = null;

  constructor (...args) {
    super(...args);
  }

  add (...args) {
    const result = super.add(...args);
    if (this.onChange) this.onChange();
    return result;
  }

  delete (...args) {
    const result = super.delete(...args);
    if (this.onChange) this.onChange();
    return result;
  }

  clear (...args) {
    if (this.onChange) this.onChange();
    super.clear(...args);
  }

  [Symbol.toStringTag] () {
    return 'ReactiveSet';
  }

  // Overwrite ReactiveSet species to the parent Set constructor
  // static get [Symbol.species]() { return Set; }

}