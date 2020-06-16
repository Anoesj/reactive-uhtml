export class ReactiveMap extends Map {

  onChange = null;

  constructor (...args) {
    super(...args);
  }

  set (...args) {
    const result = super.set(...args);
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
    return 'ReactiveMap';
  }

  // Overwrite ReactiveMap species to the parent Map constructor
  // static get [Symbol.species]() { return Map; }

}