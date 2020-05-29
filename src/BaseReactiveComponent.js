import { html, svg, render } from '../../web_modules/uhtml/esm/index.js';
// import * as µhtml from '../../web_modules/uhtml/esm/index.js';

const colors = {
  blue: '#1877f2',
  green: 'MediumSeaGreen',
  greyLight: '#dee5ec',
};

const queue = new class Queue {

  #componentsToRender = new Set();

  constructor () {
    setInterval(() => {
      this.tick();
    }, 5);
  }

  tick () {
    for (const component of this.#componentsToRender) {
      component.render();
    }

    this.#componentsToRender.clear();
  }

  render (component) {
    this.#componentsToRender.add(component);
  }

}

class BaseReactiveComponent {

  // Makes a data object 'reactive'.
  // NOTE: Will probably only trigger reactivity when Object values are reassigned, not when deeper objects are mutated.
  reactive (data) {
    return new Proxy(data, {
      set: (target, property, value, receiver) => {
        console.log(`%c[${this.constructor.name}]%c – %cChange detected`, `color: ${colors.green};`, `color: ${colors.greyLight};`, `color: ${colors.greyLight};`);
        const success = Reflect.set(target, property, value, receiver);
        // IDEA: Create setting with default that defines the rendering mode (whether the Queue is used, or the render function is called immediately).
        // Queue prevents double renders when changing multiple reactive variables in a row.
        queue.render(this);
        // this.render(); // This is the version that doesn't debounce/deduplicate renders
        return success;
      },
    });
  }

  // computed (data) {
  //   switch (typeof data) {
  //     // getter only
  //     case 'function':
  //       break;
  //     // getter and setter
  //     case 'object':
  //       break;
  //   }
  // }

  render () {
    this.logRendering();
    render(this, this.renderFunction);
  }

  logRendering () {
    console.log(`%c[${this.constructor.name}]%c – %cRendering`, `color: ${colors.green};`, `color: ${colors.greyLight};`, `color: ${colors.blue};`);
  }

}

Object.defineProperty(BaseReactiveComponent.prototype, 'html', {
  enumerable: false,
  writable: true,
  configurable: true,
  value: html,
});

Object.defineProperty(BaseReactiveComponent.prototype, 'svg', {
  enumerable: false,
  writable: true,
  configurable: true,
  value: svg,
});

// Object.assign(BaseReactiveComponent.prototype, µhtml);
// BaseReactiveComponent.prototype.html = html;
// BaseReactiveComponent.prototype.svg = svg;

// console.log(Object.getOwnPropertyDescriptors(BaseReactiveComponent.prototype));

export {
  BaseReactiveComponent,
};