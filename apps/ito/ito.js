import swal from 'sweetalert2'
import template from './ito.html'
import { initWeb3 } from 'apps/utils'
import contractFactory from './contract'

const web3 = initWeb3()

class ITOApp extends HTMLElement {
  connectedCallback () {
    this.innerHTML = template
    this.addresses = []
    this.contract = contractFactory(web3)
    this.getAccount()
    this.attachEventListeners()
    this.unsubscribe = this.contract.addEventListener(this.onPurchase.bind(this))
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

    this.querySelector('[data-purchase]').addEventListener('click', () => {
      const value = this.querySelector('[data-input-amount]').value
      this.purchase(value)
    })

    this.querySelector('[data-start]').addEventListener('click', () => {
      this.start()
    })

    this.querySelector('[data-stop]').addEventListener('click', () => {
      this.stop()
    })
  }

  async deploy (owner) {
    try {
      await this.contract.deploy(owner)
      this.querySelector('[data-contract-address]').innerText = this.contract.address
      await this.list()
      await this.printStatus()
    } catch (e) {
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
  }

  onPurchase (newAddress) {
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
      await this.printStatus()
    } catch (e) {
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
  }

  async start () {
    try {
      await this.contract.start(this.account)
      await this.printStatus()
    } catch (e) {
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
  }

  async stop () {
    try {
      await this.contract.stop(this.account)
      await this.printStatus()
    } catch (e) {
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
  }

  async purchase (amount) {
    try {
      await this.contract.purchase({
        receiver: this.account,
        amount: web3.utils.toWei(amount, 'ether')
      })
      this.list()
    } catch (e) {
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
  }

  async printStatus () {
    const status = await this.contract.getStatus()
    this.querySelector('[data-ito-status]').innerText = status
  }

  async list () {
    const tokensLeft = await this.contract.getTokensLeft()
    this.querySelector('[data-tokens-left]').innerText = `Tokens left ${tokensLeft}`

    const myTokens = await this.contract.getBalance(this.account)
    this.querySelector('[data-my-tokens]').innerText = `My Tokens ${myTokens}`
  }
}

window.customElements.define('eth-ito', ITOApp)
