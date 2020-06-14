export class ReactiveMap extends Map {

  onSet = null;

  constructor (...args) {
    super(...args);
  }

  set (...args) {
    const result = super.set(...args);
    if (this.onSet) this.onSet();
    return result;
  }

  get (...args) {
    return super.get(...args);
  }

  [Symbol.toStringTag] () {
    return 'ReactiveMap';
  }

  // Overwrite ReactiveMap species to the parent Map constructor
  // static get [Symbol.species]() { return Map; }

}