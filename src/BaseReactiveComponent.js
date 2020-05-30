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
      if (this.#componentsToRender.size) {
        this.tick();
      }
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

  get renderStrategy () {
    return 'defer'; // defer|immediately
  }

  // Makes a data object 'reactive'.
  // NOTE: Will probably only trigger reactivity when Object values are reassigned, not when deeper objects are mutated.
  reactive (data) {

    this.boundRenderFunction = this.renderFunction.bind(this);

    return new Proxy(data, {
      set: (target, property, value, receiver) => {
        console.log(`%c${this.constructor.name}%c – %cChange detected`, `color: ${colors.green};`, `color: ${colors.greyLight};`, `color: ${colors.greyLight};`);
        const success = Reflect.set(target, property, value, receiver);

        switch (this.renderStrategy) {
          case 'defer':
            // Queue prevents double renders when changing multiple reactive variables in a row.
            queue.render(this);
            break;
          case 'immediately':
            // Don't defer renders
            this.render();
            break;
          default:
            throw new Error('Unknown render strategy.');
        }
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
    render(this, this.boundRenderFunction);
  }

  logRendering () {
    console.log(`%c${this.constructor.name}%c – %cRendering (strategy: ${this.renderStrategy})`, `color: ${colors.green};`, `color: ${colors.greyLight};`, `color: ${colors.blue};`);
  }

}

// Object.defineProperty(BaseReactiveComponent.prototype, 'html', {
//   enumerable: false,
//   writable: true,
//   configurable: true,
//   value: html,
// });

// Object.defineProperty(BaseReactiveComponent.prototype, 'svg', {
//   enumerable: false,
//   writable: true,
//   configurable: true,
//   value: svg,
// });

BaseReactiveComponent.prototype.html = function () {
  const boundArguments = [...arguments].map(argument => {
    if (typeof argument === 'function') {
      return argument.bind(this);
    }
    return argument;
  });
  return html.apply(this, boundArguments);
};
BaseReactiveComponent.prototype.svg = svg;
// Object.assign(BaseReactiveComponent.prototype, µhtml);

// console.log(Object.getOwnPropertyDescriptors(BaseReactiveComponent.prototype));

export {
  BaseReactiveComponent,
};
