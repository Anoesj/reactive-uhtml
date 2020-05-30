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

  render () {
    if (this._bound === undefined) {
      this._autobind();
      this._bound = true;
    }

    this.logRendering();
    render(this, this.template);
  }

  _autobind () {
    for (const [propertyName, propertyDescriptor] of Object.entries(Object.getOwnPropertyDescriptors(this.constructor.prototype))) {
      if (propertyName === 'constructor') continue;

      // If property has a normal value and the value is a function
      if (typeof propertyDescriptor.value === 'function') {
        propertyDescriptor.value = propertyDescriptor.value.bind(this);
        if (Reflect.defineProperty(this.constructor.prototype, propertyName, propertyDescriptor)) {
          console.log(`%c%s%c – %cBound property “%s”`, `color: ${colors.green};`, this.constructor.name, `color: ${colors.greyLight};`, `color: ${colors.grey};`, propertyName);
        }
      }
      else {
        const bindGetter = typeof propertyDescriptor.get === 'function',
              bindSetter = typeof propertyDescriptor.set === 'function';

        // Bind getter if function
        if (bindGetter) {
          propertyDescriptor.get = propertyDescriptor.get.bind(this);
        }
        // Bind setter if function
        if (bindSetter) {
          propertyDescriptor.set = propertyDescriptor.set.bind(this);
        }

        if (bindGetter || bindSetter) {
          if (Reflect.defineProperty(this.constructor.prototype, propertyName, propertyDescriptor)) {
            const getterAndOrSetterString = (bindGetter && bindSetter) ? 'getter/setter' : bindGetter ? 'getter' : 'setter';
            console.log(`%c%s%c – %cBound property %s “%s”`, `color: ${colors.green};`, this.constructor.name, `color: ${colors.greyLight};`, `color: ${colors.grey};`, getterAndOrSetterString, propertyName);
          }
        }
      }
    }
  }

  // Makes a data object 'reactive'.
  // NOTE: Will probably only trigger reactivity when Object values are reassigned, not when deeper objects are mutated.
  reactive (data) {
    return new Proxy(data, {
      set: (target, property, value, receiver) => {
        console.log(`%c%s%c – %cChange detected`, `color: ${colors.green};`, this.constructor.name, `color: ${colors.greyLight};`, `color: ${colors.grey};`);
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

  logRendering () {
    console.log(`%c${this.constructor.name}%c – %cRendering (strategy: ${this.renderStrategy})`, `color: ${colors.green};`, `color: ${colors.greyLight};`, `color: ${colors.blue};`);
  }

}

BaseReactiveComponent.prototype.html = html;
BaseReactiveComponent.prototype.svg = svg;

export {
  BaseReactiveComponent,
};