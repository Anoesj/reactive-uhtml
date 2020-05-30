export const RenderQueue = new class RenderQueue {

  #componentsToRender = new Set();
  doTick = this.tick.bind(this);

  constructor () {
    requestAnimationFrame(this.doTick);
  }

  tick () {
    for (const component of this.#componentsToRender) {
      component.render();
    }

    this.#componentsToRender.clear();
    requestAnimationFrame(this.doTick);
  }

  render (component) {
    this.#componentsToRender.add(component);
  }

}