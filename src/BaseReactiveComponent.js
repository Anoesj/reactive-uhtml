import { html, svg, render } from '../../web_modules/uhtml/esm/index.js';
import { Dep } from './Dep.js';
import { ReactiveHole } from './ReactiveHole.js';

// TODO: Try same with svg
const reactiveHtml = (template, ...values) => new ReactiveHole('html', template, values);
Object.defineProperties(reactiveHtml, Object.getOwnPropertyDescriptors(html));

const colors = {
  blue: '#1877f2',
  green: 'MediumSeaGreen',
  greyLight: '#dee5ec',
};

class BaseReactiveComponent {

  get renderStrategy () {
    return 'defer'; // 'defer' | 'immediately'
  }

  render () {
    if (this._bound === undefined) {
      this._autobind();
      this._bound = true;
    }

    this.logRendering();

    // Provide the original values instead of ReactiveHole instances as values
    const data = Object.fromEntries(
      Object.entries(this.data).map(([property, hole]) => [property, hole.value])
    );
    render(this, this.template(data));
  }

  _autobind () {
    for (const [propertyName, propertyDescriptor] of Object.entries(Object.getOwnPropertyDescriptors(this.constructor.prototype))) {
      if (propertyName === 'constructor') continue;

      // If property has a normal value and the value is a function
      if (typeof propertyDescriptor.value === 'function') {
        propertyDescriptor.value = propertyDescriptor.value.bind(this);
        if (Reflect.defineProperty(this.constructor.prototype, propertyName, propertyDescriptor)) {
          // console.log(`%c%s%c – %cBound property “%s”`, `color: ${colors.green};`, this.constructor.name, `color: ${colors.greyLight};`, `color: ${colors.grey};`, propertyName);
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
            // const getterAndOrSetterString = (bindGetter && bindSetter) ? 'getter/setter' : bindGetter ? 'getter' : 'setter';
            // console.log(`%c%s%c – %cBound property %s “%s”`, `color: ${colors.green};`, this.constructor.name, `color: ${colors.greyLight};`, `color: ${colors.grey};`, getterAndOrSetterString, propertyName);
          }
        }
      }
    }
  }

  // Makes a data object 'reactive'.
  // NOTE: Will probably only trigger reactivity when Object values are reassigned, not when deeper objects are mutated.
  reactive (data) {
    const deps = new Map();

    const declareReactiveProperty = (property, value) => {
      deps.set(property, new Dep(property));
      data[property] = reactiveHtml`${value}`;
    };

    for (const [property, value] of Object.entries(data)) {
      // Replace the value with a ReactiveHole instance.
      declareReactiveProperty(property, value);
    }

    // console.log(data);

    return new Proxy(data, {

      get: (target, property, receiver) => {
        // Register the callee as a subscriber
        // TODO: subscribe should be called with the watcher function as argument
        deps.get(property).subscribe(this.render);
        // Perform the actual get
        return Reflect.get(target, property, receiver);
      },

      set: (target, property, value, receiver) => {
        console.log(`%c%s%c – %cChange detected`, `color: ${colors.green};`, this.constructor.name, `color: ${colors.greyLight};`, `color: ${colors.grey};`);

        // If property is added after the "wrapping in Proxy" phase, add to deps
        if (!deps.has(property)) {
          declareReactiveProperty(property, value);
        }

        Reflect.get(target, property, receiver).value = value;
        deps.get(property).notify();
        return true;

        // // Perform the actual set
        // const result = Reflect.set(target, property, value, receiver);
        // // Notify subscribers of property
        // if (result === true) deps.get(property).notify();
        // Return success boolean
        // return result;
      },

      deleteProperty (target, property) {
        if (property in target) {
          // Delete the property from deps
          deps.delete(property);
          // Perform the actual delete
          const result = Reflect.deleteProperty(target, property);
          return result;
        }
      },

      // set: function notify (target, property, value, receiver) {
      //   // console.log(`%c%s%c – %cChange detected`, `color: ${colors.green};`, this.constructor.name, `color: ${colors.greyLight};`, `color: ${colors.grey};`);
      //   const success = Reflect.set(...arguments);

      //   switch (self.renderStrategy) {
      //     case 'defer':
      //       // RenderQueue prevents double renders when changing multiple reactive variables in a row.
      //       RenderQueue.render(self);
      //       break;
      //     case 'immediately':
      //       // Don't use RenderQueue, just render immediately instead.
      //       self.render();
      //       break;
      //     default:
      //       throw new Error('Unknown render strategy.');
      //   }

      //   return success;
      // },

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

// BaseReactiveComponent.prototype.html = html;
BaseReactiveComponent.prototype.html = reactiveHtml;
BaseReactiveComponent.prototype.svg = svg;

export {
  BaseReactiveComponent,
};