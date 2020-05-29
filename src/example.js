import { define } from './define.js';

define('time-passed', class TimePassed extends HTMLElement {

  get renderStrategy () {
    return 'immediately';
  }

  static get observedAttributes () {
    return ['paused'];
  }

  data = this.reactive({
    seconds: 0,
  });

  renderFunction = function () {
    return this.html`<p>Seconds passed: ${this.data.seconds}</p>`;
  }.bind(this);

  intervalFn = null;

  addSecond () {
    this.data.seconds++;
  }

  connectedCallback () {
    this.render();
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'paused') {
      if (newValue === 'true') {
        if (this.intervalFn !== null) {
          clearInterval(this.intervalFn);
        }
      }
      else if (newValue === 'false') {
        this.intervalFn = setInterval(this.addSecond.bind(this), 1000);
      }
    }
  }

});

define('example-element', class ExampleElement extends HTMLElement {

  static get observedAttributes () {
    return ['foo'];
  }

  data = this.reactive({
    count: 0,
    timerPaused: false,
  });

  renderFunction = function () {
    return this.html`
      <strong>Count: ${this.data.count}</strong><br/>
      <button onclick="${this.add.bind(this)}">Add</button>
      <button onclick="${this.remove.bind(this)}" disabled="${this.data.count === 0 || null }">Remove</button>

      <time-passed paused="${this.data.timerPaused}"/>

      <input
        id="timer-paused"
        type="checkbox"
        checked="${this.data.timerPaused ? 'checked' : null}"
        onclick="${() => { this.data.timerPaused = !this.data.timerPaused; }}"
      /><label for="timer-paused">Pause timer</label>
    `;
  }.bind(this);

  add () {
    this.data.count++;
  }

  remove () {
    this.data.count--;
  }

  connectedCallback () {
    this.render();
  }

  disconnectedCallback () {
    console.log('DISCONNECTED', this);
  }

  attributeChangedCallback (name, oldValue, newValue) {
    console.log('ATTRIBUTE CHANGED:', {
      name,
      oldValue,
      newValue,
    });
  }

});

// define('example-element', class ExampleElement {

//   static get observedAttributes () {
//     return ['foo'];
//   }

//   test = 'class fields working';

//   connectedCallback () {
//     console.log(this.test); // :(

//     this.data = this.reactive({
//       counter: 1,
//     });

//     this.renderFunction = function () {
//       return this.html`<strong>🎉 I can render myself ${this.data.counter}</strong>`;
//     }.bind(this);

//     this.render();

//     setInterval(() => {
//       this.data.counter++;
//     }, 1000);
//   }

//   disconnectedCallback () {
//     console.log(this, 'DISCONNECTED');
//   }

//   attributeChangedCallback (name, oldValue, newValue) {
//     console.log(this, 'ATTRIBUTE CHANGED:', {
//       name,
//       oldValue,
//       newValue,
//     });
//   }

// });

// define('another-element', class {

//   connectedCallback () {
//     console.log(this, 'CONNECTED');
//   }

// }, 'p');

// document.body.appendChild(document.createElement('test-element'));
// document.body.appendChild(document.createElement('another-element'));

// for (const el of document.body.children) {
//   customElements.upgrade(el);
// }