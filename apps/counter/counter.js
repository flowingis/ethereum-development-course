import Web3 from 'web3'
import truffleContract from 'truffle-contract'

import metaCoinArtifact from '../../build/contracts/LoggableCounter.json'

import template from './counter.html'
import { web3ProviderFix, htmlToElement } from 'apps/utils'

const LoggableCounter = truffleContract(metaCoinArtifact)
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545'))
LoggableCounter.setProvider(web3.currentProvider)
web3ProviderFix(LoggableCounter)

class CounterApp extends HTMLElement {
  connectedCallback () {
    this.innerHTML = template

    this.attachEventListeners()

    this.getAccounts()
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
    await this.contract.increment({ from: address })
    await this.getCounter()
  }

  async reset (address) {
    await this.contract.reset({ from: address })
    await this.getCounter()
  }

  async deploy (address) {
    this.contract = await LoggableCounter.new({
      from: address,
      gas: 4712388,
      gasPrice: 100000000000
    })

    const resetEvent = this.contract.Reset()
    const incrementEvent = this.contract.Increment()
    const divisibleByTenEvent = this.contract.DivisibleByTen()

    const onEvent = eventName => () => this.addEvent(eventName)

    resetEvent.watch(onEvent('Reset'))
    incrementEvent.watch(onEvent('Increment'))
    divisibleByTenEvent.watch(onEvent('DivisibleByTen'))

    this.querySelector('[data-contract-address]').innerText = this.contract.address
    await this.getCounter()
  }

  async getCounter () {
    const counter = await this.contract.counter()
    this.querySelector('[data-contract-counter]').innerText = counter.toNumber()
  }

  addEvent (eventName) {
    const item = `<div class="item">${eventName}</div>`
    this.querySelector('[data-events-list]').appendChild(htmlToElement(item))
  }
}

window.customElements.define('eth-counter', CounterApp)
