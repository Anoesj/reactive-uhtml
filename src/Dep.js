import { RenderQueue } from './RenderQueue.js';

export class Dep {

  // '#subscribers' values should all be watcher functions
  #subscribers = new Set();
  #property;

  constructor (property) {
    this.#property = property;
  }

  subscribe (watcher) {
    this.#subscribers.add(watcher);
  }

  notify () {
    for (const watchingElement of this.#subscribers) {
      console.log(`Triggering watcher for property “${this.#property}”`);
      RenderQueue.render(watchingElement);
    }
  }

}