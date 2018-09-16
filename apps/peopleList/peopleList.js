import template from './peopleList.html'

class PeopleListApp extends HTMLElement {
  connectedCallback () {
    this.innerHTML = template
  }
}

window.customElements.define('eth-people-list', PeopleListApp)
