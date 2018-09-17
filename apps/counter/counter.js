import swal from 'sweetalert2'
import template from './counter.html'
import { htmlToElement, initWeb3 } from 'apps/utils'
import contractFactory from './contract'

const web3 = initWeb3()

class CounterApp extends HTMLElement {
  connectedCallback () {
    this.innerHTML = template
    this.attachEventListeners()
    this.getAccounts()
    this.contract = contractFactory(web3)
    this.unsubscribe = this.contract.addEventListener(this.addEvent.bind(this))
  }

  disconnectedCallback () {
    this.unsubscribe()
  }

  attachEventListeners () {
    this.querySelector('[data-first-deploy]').addEventListener('click', () => {
      this.deploy(this.firstAccount)
    })

    this.querySelector('[data-first-increment]').addEventListener('click', () => {
      this.increment(this.firstAccount)
    })

    this.querySelector('[data-first-reset]').addEventListener('click', () => {
      this.reset(this.firstAccount)
    })

    this.querySelector('[data-second-deploy]').addEventListener('click', () => {
      this.deploy(this.secondAccount)
    })

    this.querySelector('[data-second-increment]').addEventListener('click', () => {
      this.increment(this.secondAccount)
    })

    this.querySelector('[data-second-reset]').addEventListener('click', () => {
      this.reset(this.secondAccount)
    })
  }

  async getAccounts () {
    [this.firstAccount, this.secondAccount] = await web3.eth.getAccounts()
    this.querySelector('[data-first-account]').innerText = this.firstAccount
    this.querySelector('[data-second-account]').innerText = this.secondAccount
  }

  async increment (address) {
    try {
      await this.contract.increment(address)
      await this.getCounter()
    } catch (e) {
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
  }

  async reset (address) {
    try {
      await this.contract.reset(address)
      await this.getCounter()
    } catch (e) {
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
  }

  async deploy (owner) {
    try {
      await this.contract.deploy(owner)
      this.querySelector('[data-contract-address]').innerText = this.contract.address
      await this.getCounter()
    } catch (e) {
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
  }

  async getCounter () {
    try {
      const counter = await this.contract.getValue()
      this.querySelector('[data-contract-counter]').innerText = counter.toNumber()
    } catch (e) {
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
  }

  addEvent (eventName) {
    const item = `<div class="item">${eventName}</div>`
    this.querySelector('[data-events-list]').appendChild(htmlToElement(item))
  }
}

window.customElements.define('eth-counter', CounterApp)
