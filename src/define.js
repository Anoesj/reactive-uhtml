import { BaseReactiveComponent } from './BaseReactiveComponent.js';

export function define (componentName, component, extendsElement) {
  let HTMLClass;
  if (extendsElement) {
    HTMLClass = Reflect.getPrototypeOf(document.createElement(extendsElement).constructor);
  }
  else {
    HTMLClass = HTMLElement;
  }

  // Create a new class that extends the HTML interface belonging to element the user wants to extend.
  // We'll inject methods of BaseReactiveComponent into this class.
  // Then we'll extend this class when we create our custom element class.
  class ReactiveComponent extends HTMLClass {}

  // Apply prototype of class BaseReactiveComponent on ReactiveComponent
  for (const [propertyName, propertyDescriptor] of Object.entries(Object.getOwnPropertyDescriptors(BaseReactiveComponent.prototype))) {
    Reflect.defineProperty(ReactiveComponent.prototype, propertyName, propertyDescriptor);
  }

  // This will be our custom element's constructor.
  function CustomElement () {
    // new.target is this constructor function itself
    return Reflect.construct(ReactiveComponent, [], new.target);
  }

  CustomElement.prototype = Object.create(ReactiveComponent.prototype);

  // Apply prototype of class 'component'
  for (const [propertyName, propertyDescriptor] of Object.entries(Object.getOwnPropertyDescriptors(component.prototype))) {
    Reflect.defineProperty(CustomElement.prototype, propertyName, propertyDescriptor);
  }

  if (extendsElement) {
    customElements.define(componentName, CustomElement, {
      extends: extendsElement,
    });
  }
  else {
    customElements.define(componentName, CustomElement);
  }
}