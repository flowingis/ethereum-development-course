import template from './counter.html'

class CounterApp extends HTMLElement {
  connectedCallback () {
    this.innerHTML = template
  }
}

window.customElements.define('eth-counter', CounterApp)
