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

  get template () {
    return this.html`<p>Seconds passed: ${this.data.seconds}</p>`;
  }

  connectedCallback () {
    // console.log(this.data);
    this.render();
  }

  intervalFn = null;

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

  addSecond () {
    this.data.seconds++;
  }

});

define('example-element', class ExampleElement extends HTMLElement {

  static get observedAttributes () {
    return ['foo'];
  }

  data = this.reactive({
    count: 0,
    timerPaused: true,
  });

  get template () {
    const { data } = this;

    return this.html`
      <h2>🎉 Reactive µhtml web components!</h2>
      <h3>A simple counter</h3>
      <p>Count: ${data.count}</strong><br/>
      <button onclick="${this.add}">Add</button>
      <button onclick="${this.remove}" disabled="${data.count === 0 || null }">Remove</button></p>

      <h3>A nested reactive web component</h3>
      <time-passed paused="${data.timerPaused}"/>

      <h3>Control other web component's attributes</h3>
      <input
        id="timer-paused"
        type="checkbox"
        checked="${data.timerPaused ? 'checked' : null}"
        onclick="${() => { data.timerPaused = !data.timerPaused; }}"
      /><label for="timer-paused">Pause timer</label>
    `;
  }

  // IDEA: All getters are computed functions by default (this.template too, but when template changes, this.render needs to be called)
  // IDEA: setters for the same property automatically trigger reactivity too
  get computed () {
    console.log(this.data.count + 1);
  }

  // test = this.watcher -> nope, needs to be method

  add () {
    this.data.count++;
  }

  remove () {
    this.data.count--;
  }

  connectedCallback () {
    this.render();
  }

  disconnectedCallback () {}

  attributeChangedCallback (name, oldValue, newValue) {}

});