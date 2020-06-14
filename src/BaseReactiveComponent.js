import { html, svg, render } from '../../web_modules/uhtml/esm/index.js';
// import { Dep } from './Dep.js';
import { RenderQueue } from './RenderQueue.js';
import { ReactiveMap } from './ReactiveMap.js';

const colors = {
  blue: '#1877f2',
  green: 'MediumSeaGreen',
  greyLight: '#dee5ec',
};

class BaseReactiveComponent {

  connectedCallback () {
    this.render();
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
    console.log('Making data reactive:', data);

    // const deps = new Map();

    const declareReactiveProperty = (property, value, data) => {
      // if (Array.isArray(value)) {
      //   data[property] = this.reactive(value);
      // }

      // If value is a Map, replace it with a ReactiveMap and let ReactiveMap signal us on change.
      if (value instanceof Map) {
        const reactiveMap = new ReactiveMap(value.entries());
        reactiveMap.onSet = () => void RenderQueue.render(this);
        data[property] = reactiveMap;
      }

      // TODO: Object, Array, Set, WeakMap, WeakSet and probably more...

      // deps.set(property, new Dep(property));
    }

    for (const [property, value] of Object.entries(data)) {
      declareReactiveProperty(property, value, data);
    }

    const reactiveData = new Proxy(data, {

      get: (target, property, receiver) => {
        console.log('Getting', property);
        // Register the render function as a subscriber
        // debugger;
        // const descriptor = Reflect.getOwnPropertyDescriptor(target, property);
        // if (descriptor) {
        //   if (descriptor.enumerable === true) {
        //     console.log(property);
        //     // deps.get(property).subscribe(this);
        //   }
        // }
        // Perform the actual get
        return Reflect.get(target, property, receiver);
      },

      set: (target, property, value, receiver) => {
        console.log(`%c%s%c – %cChange detected for property %s`, `color: ${colors.green};`, this.constructor.name, `color: ${colors.greyLight};`, `color: ${colors.grey};`, property);

        // If property is added after the "wrapping in Proxy" phase, add to deps
        // TODO: This will break right now. We need to be able to detect which properties we've already made reactive
        // if (!deps.has(property)) {
        //   declareReactiveProperty(property, value, target);
        // }

        // Perform the actual set
        const result = Reflect.set(target, property, value, receiver);
        // Notify subscribers of property
        if (result === true) {
          RenderQueue.render(this);
          // const depInstance = deps.get(property);
          // console.warn('Notifying dep', depInstance);
          // depInstance.notify();
        }
        // Return success boolean
        return result;
      },

      deleteProperty (target, property) {
        if (property in target) {
          // Delete the property from deps
          // deps.delete(property);
          // Perform the actual delete
          const result = Reflect.deleteProperty(target, property);
          if (result === true) {
            RenderQueue.render(this);
          }
          // Return success boolean
          return result;
        }
      },

    });

    console.log('Made data reactive:', reactiveData);
    return reactiveData;
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
    console.groupCollapsed(`%c${this.constructor.name}%c – %cRendering`, `color: ${colors.green};`, `color: ${colors.greyLight};`, `color: ${colors.blue};`);
    console.trace();
    console.groupEnd();
  }

}

BaseReactiveComponent.prototype.html = html;
BaseReactiveComponent.prototype.svg = svg;

export {
  BaseReactiveComponent,
};