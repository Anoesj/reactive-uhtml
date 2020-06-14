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
    count: 0,
    otherCount: 0,
    timerPaused: true,
    someMap: new Map([['foo', 'bar']]),
    // someArray: ['a'],
  });

  // TODO: computeds array existing of names of getter properties should be iterated. they should be cached instead of called everytime they're referenced.
  // computeds = [
  //   'otherCountTimesTen',
  // ];

  // get computeds () {
  //   return [
  //     'otherCountTimesTen',
  //   ];
  // }

  get template () {
    // NOTE: Use data for reading, this.data for writing!
    const {
      count,
      timerPaused,
      yoo,
      someMap,
      // someArray,
    } = this.data;

    const mapList = Array.from(someMap).map(([key, value]) => this.html`<li>${key}: ${value}</li>`);

    return this.html`
      <h1>${yoo}</h1>
      <h2>🎉 Reactive µhtml web components!</h2>
      <h3>A simple counter</h3>

      <p>Count: ${count}</strong><br/>
      <button onclick="${this.addCount}">Add</button>
      <button onclick="${this.removeCount}" disabled="${count === 0 || null}">Remove</button></p>

      <p>Other count times 10: ${this.otherCountTimesTen} (computed)</strong><br/>
      <button onclick="${this.addOtherCount}">Add</button>
      <button onclick="${this.removeOtherCount}">Remove</button></p>

      <h3>Reactive Map</h3>
      <ul>
        ${mapList}
      </ul>
    `;

    // <time-passed paused="${timerPaused}"/>
    // <ul>
    //   ${someArray.map(item => this.html`<li>${item}</li>`)}
    // </ul>
    // <time-passed paused="${timerPaused}"/>
    // <h3>A nested reactive web component</h3>

    // <h3>Control other web component's attributes</h3>
    // <input
    //   id="timer-paused"
    //   type="checkbox"
    //   checked="${timerPaused ? 'checked' : null}"
    //   onclick="${() => { timerPaused = !timerPaused; }}"
    // /><label for="timer-paused">Pause timer</label>
  }

  // IDEA: All getters are computed functions by default (this.template too, but when template changes, this.render needs to be called)
  // IDEA: setters for the same property automatically trigger reactivity too
  // TODO: Cache computeds
  get otherCountTimesTen () {
    // console.log('Invoked getter otherCountTimesTen');
    return this.data.otherCount * 10;
  }

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
    this.data.yoo = 'yooooo';
    // setTimeout(() => {
    //   console.log(this.querySelector('time-passed'));
    // }, 500);
    // setInterval(() => {
    //   console.log(this.data.someArray);
    //   this.data.someArray.push(Math.random());
    // }, 1000);
    const randomFoos = ['bar', 'baz', 'lorem', 'ipsum', 'dolor', 'sit', 'amet'];
    let index = 0;
    setInterval(() => {
      if (index === randomFoos.length - 1) index = 0;
      else index++;
      this.data.someMap.set('foo', randomFoos[index]);
      // this.data.someArray.push(Math.random());
    }, 1000);
  }

  // disconnectedCallback () {}

  // attributeChangedCallback (name, oldValue, newValue) {}

});