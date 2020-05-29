import { define } from './define.js';

define('example-element', class ExampleElement {

  static get observedAttributes () {
    return ['foo'];
  }

  test = 'class fields working';

  connectedCallback () {
    console.log(this.test); // :(

    this.data = this.reactive({
      counter: 1,
    });

    this.renderFunction = function () {
      return this.html`<strong>🎉 I can render myself ${this.data.counter}</strong>`;
    }.bind(this);

    this.render();

    setInterval(() => {
      this.data.counter++;
    }, 1000);
  }

  disconnectedCallback () {
    console.log(this, 'DISCONNECTED');
  }

  attributeChangedCallback (name, oldValue, newValue) {
    console.log(this, 'ATTRIBUTE CHANGED:', {
      name,
      oldValue,
      newValue,
    });
  }

});

define('another-element', class {

  connectedCallback () {
    console.log(this, 'CONNECTED');
  }

}, 'p');

// document.body.appendChild(document.createElement('test-element'));
// document.body.appendChild(document.createElement('another-element'));

// for (const el of document.body.children) {
//   customElements.upgrade(el);
// }