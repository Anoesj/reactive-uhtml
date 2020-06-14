import { Hole } from '../../web_modules/uhtml/esm/rabbit.js';

export class ReactiveHole extends Hole {

  // This should always be constructed with 1 value
  constructor (type, template, values) {
    if (values.length !== 1) {
      console.warn(`ReactiveHole is a Hole created just so we can re-render 1 reactive. %i values were defined.`, values.length);
    }

    super(type, template, values);

    return new Proxy(this, {
      get: (target, property, receiver) => {
        console.log('getting', property);
        return Reflect.get(target, property, receiver);
      },
      // set: (target, property, value, receiver) => {
      //   console.log('setting', property, value);
      //   return Reflect.set(target, property, value, receiver);
      // },
    });
  }

  get value () {
    return this.values[0];
  }

  // [Symbol.match] (string) {
  //   console.log(`matching string “%s” to this.value “%s”`, string, this.value);
  // }

  // This makes sure you can still use the value that was entered to the ReactiveHole.
  [Symbol.toPrimitive] (type) {
    console.trace(`%cRequesting ReactiveHole as primitive: ${type}`, 'color: red; font-weight: bold;');
    switch (type) {
      case 'number':
        return Number(this.value);
      case 'string':
        return String(this.value);
      default:
        return this.value;
    }
  }

  // valueOf () {
  //   return this.values[0];
  // }

}