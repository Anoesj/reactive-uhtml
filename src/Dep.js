export class Dep {

  // '#subscribers' values should all be watcher functions
  #subscribers = new Set();

  subscribe (watcher) {
    this.#subscribers.add(watcher);
  }

  notify () {
    for (const watcher of this.#subscribers) {
      watcher();
    }
  }

}