import { BaseReactiveComponent } from './BaseReactiveComponent.js';

export function define (componentName, component, extendsElement) {
  // Apply prototype of class BaseReactiveComponent on component
  for (const [propertyName, propertyDescriptor] of Object.entries(Object.getOwnPropertyDescriptors(BaseReactiveComponent.prototype))) {
    if (propertyName in component.prototype) {
      if (propertyName === 'constructor') continue;
      if (typeof propertyDescriptor.value === 'function') {
        const ownMethod = component.prototype[propertyName];
        Reflect.defineProperty(component.prototype, propertyName, Object.assign({}, propertyDescriptor, {
          value () {
            ownMethod.apply(this, arguments);
            propertyDescriptor.value.apply(this, arguments);
          },
        }));
      }
    }
    else {
      Reflect.defineProperty(component.prototype, propertyName, propertyDescriptor);
    }
  }

  if (extendsElement) {
    customElements.define(componentName, component, {
      extends: extendsElement,
    });
  }
  else {
    customElements.define(componentName, component);
  }
}