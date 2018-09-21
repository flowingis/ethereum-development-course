import swal from 'sweetalert2'
import template from './simpleToken.html'
import { initWeb3, htmlToElement } from 'apps/utils'
import contractFactory from './contract'

const web3 = initWeb3()

class SimpleCoinApp extends HTMLElement {
  connectedCallback () {
    this.innerHTML = template
    this.addresses = []
    this.contract = contractFactory(web3)
    this.getAccount()
    this.attachEventListeners()
    this.unsubscribe = this.contract.addEventListener(this.onTransfer.bind(this))
  }

  disconnectedCallback () {
    this.unsubscribe()
  }

  async getAccount () {
    let accounts
    [this.account, ...accounts] = await web3.eth.getAccounts()
    console.log(accounts)
  }

  attachEventListeners () {
    this.querySelector('[data-deploy]').addEventListener('click', () => {
      this.deploy(this.account)
    })

    this.querySelector('[data-connect]').addEventListener('click', () => {
      this.connect(this.querySelector('[data-input-contract]').value)
    })

    this.querySelector('[data-transfer]').addEventListener('click', () => {
      const address = this.querySelector('[data-input-address]').value
      const value = this.querySelector('[data-input-value]').value
      this.transfer(address, value)
    })
  }

  async deploy (owner) {
    try {
      await this.contract.deploy(owner)
      this.querySelector('[data-contract-address]').innerText = this.contract.address
      await this.list()
    } catch (e) {
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
  }

  onTransfer (newAddress) {
    if (!this.addresses.includes(newAddress)) {
      this.addresses.push(newAddress)
    }
    this.list()
  }

  async connect (address) {
    try {
      await this.contract.connect(address)
      this.querySelector('[data-contract-address]').innerText = this.contract.address
      await this.list()
    } catch (e) {
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
  }

  async transfer (receiver, amount) {
    await this.contract.transfer({
      sender: this.account,
      receiver,
      amount
    })
    this.list()
  }

  async list () {
    const ownerBalance = await this.contract.getBalance(this.account)
    this.querySelector('[data-owner-tokens]').innerText = `${ownerBalance.balance} - ${ownerBalance.balanceInEth} ETH`

    const balances = await this.contract.getBalances(this.addresses)

    const list = this.querySelector('[data-balances]')
    list.innerHTML = ''
    balances
      .map(element => htmlToElement(`<div class="item">${element.address}: ${element.balance} - ${element.balanceInEth} ETH</div>`))
      .forEach(row => {
        list.appendChild(row)
      })
  }
}

window.customElements.define('eth-simple-coin', SimpleCoinApp)
