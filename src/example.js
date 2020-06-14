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

// let target;
// function bla (fn) {
//   target = fn;
//   fn();
//   target = null;
// }

define('example-element', class ExampleElement extends HTMLElement {

  static get observedAttributes () {
    return ['foo'];
  }

  data = this.reactive({
    // count: 0,
    count: false,
    otherCount: 0,
    timerPaused: true,
  });

  // TODO: computeds array existing of names of getter properties should be iterated. they should be cached instead of called everytime they're referenced.
  computeds = [
    'otherCountTimesTen',
  ];

  // get computeds () {
  //   return [
  //     'otherCountTimesTen',
  //   ];
  // }

  get template () {
    const {
      count,
      // timerPaused,
    } = this.data;

    // REVIEW: Problem: data.count === 0 won't evaluate data.count as a number.
    // REVIEW: Problem: data.count == 0 will, but if data.count was originally a Boolean false, data.count == 0 will evaluate true. This is because we don't have control over what the == operator does. 
    console.log('Gonna request count in a number of ways');
    console.log({
      'count': count,
      'count == 0': count == 0,
      'count === 0': count === 0,
      'Number(count) === 0': Number(count) === 0,
    });

    // if (count && count == 0) {
    //   console.log('Requested count', count);
    // }

    return this.html`
      <h2>🎉 Reactive µhtml web components!</h2>
      <h3>A simple counter</h3>

      <p>Count: ${count}</strong><br/>
      <button onclick="${this.addCount}">Add</button>
      <button onclick="${this.removeCount}" disabled="${count == 0 || null}">Remove</button></p>

      <p>Other count times 10: ${this.otherCountTimesTen} (computed)</strong><br/>
      <button onclick="${this.addOtherCount}">Add</button>
      <button onclick="${this.removeOtherCount}">Remove</button></p>
    `;
    // <time-passed paused="${timerPaused}"/>
    // <h3>A nested reactive web component</h3>

    // <h3>Control other web component's attributes</h3>
    // <input
    //   id="timer-paused"
    //   type="checkbox"
    //   checked="${timerPaused ? 'checked' : null}"
    //   onclick="${() => { this.data.timerPaused = !timerPaused; }}"
    // /><label for="timer-paused">Pause timer</label>
  }

  // IDEA: All getters are computed functions by default (this.template too, but when template changes, this.render needs to be called)
  // IDEA: setters for the same property automatically trigger reactivity too
  get otherCountTimesTen () {
    // console.log('Invoked getter otherCountTimesTen');
    return this.data.otherCount * 10;
  }

  // test = this.watcher -> nope, needs to be method

  addCount () {
    this.data.count++;
  }

  removeCount () {
    this.data.count--;
  }

  addOtherCount () {
    this.data.otherCount++;
  }

  removeOtherCount () {
    this.data.otherCount--;
  }

  connectedCallback () {
    this.render();
  }

  disconnectedCallback () {}

  attributeChangedCallback (name, oldValue, newValue) {}

});