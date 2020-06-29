import { colors } from './helpers.js';

export const RenderQueue = new class RenderQueue {

  #componentsToRender = new Set;
  #changes = new Set;
  doTick = this.tick.bind(this);

  constructor () {
    requestAnimationFrame(this.doTick);
  }

  tick () {
    // for (const change of this.#componentsToRender) {
    // }
    // const changes = Array.from(this.#changes);
    // console.log(`%c%s%c – %cChange detected for property %s`, `color: ${colors.green};`, this.constructor.name, `color: ${colors.greyLight};`, `color: ${colors.grey};`, property);
    // TODO: Improve logs with groupCollapsed
    const changesAmount = this.#changes.size;
    if (changesAmount) {
      console.log(`%c${changesAmount} change${changesAmount === 1 ? '' : 's'} detected`, `color: ${colors.greyLight};`);
    }

    for (const component of this.#componentsToRender) {
      component.render();
    }

    this.#componentsToRender.clear();
    this.#changes.clear();
    requestAnimationFrame(this.doTick);
  }

  render (component) {
    this.#componentsToRender.add(component);
  }

  logChange (componentInstance, property) {
    this.#changes.add({
      component: componentInstance.constructor.name ?? 'Anonymous Component',
      property,
    });
  }

  // ['test.hallo'] () {
  //   console.log('yo');
  // }

}

// console.log(RenderQueue['test.hallo']);