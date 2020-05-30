import { BaseReactiveComponent } from './BaseReactiveComponent.js';

export function define (componentName, component, extendsElement) {
  // for (const [propertyName, propertyDescriptor] of Object.entries(Object.getOwnPropertyDescriptors(component.prototype))) {
  //   if (propertyName === 'constructor') continue;
  //   console.log(propertyName, propertyDescriptor);
  //   if (typeof propertyDescriptor.value === 'function') {
  //     propertyDescriptor.value = propertyDescriptor.value.bind(component.prototype);
  //     Object.defineProperty(component.prototype, propertyName, propertyDescriptor);
  //     console.log(`Autobound ${propertyName} to ${component.prototype.constructor.name}`);
  //   }
  // }

  // Apply prototype of class BaseReactiveComponent on component
  for (const [propertyName, propertyDescriptor] of Object.entries(Object.getOwnPropertyDescriptors(BaseReactiveComponent.prototype))) {
    if (!(propertyName in component.prototype)) {
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