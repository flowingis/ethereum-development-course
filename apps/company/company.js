import swal from 'sweetalert2'
import template from './company.html'
import { initWeb3, htmlToElement } from 'apps/utils'
import contractFactory from './contract'

const web3 = initWeb3()

class CompanyApp extends HTMLElement {
  connectedCallback () {
    this.innerHTML = template
    this.contract = contractFactory(web3)
    this.getAccount()
    this.attachEventListeners()
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

    this.querySelector('[data-add]').addEventListener('click', () => {
      const address = this.querySelector('[data-input-address]').value
      this.add(address)
    })

    this.querySelector('[data-pay]').addEventListener('click', () => {
      const value = this.querySelector('[data-input-value]').value
      this.pay(value)
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

  async add (address) {
    try {
      await this.contract.add(this.account, address)
      await this.list()
    } catch (e) {
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
  }

  async pay (value) {
    try {
      await this.contract.pay(this.account, value)
      await this.list()
    } catch (e) {
      console.error(e)
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
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

  async list () {
    const ownerBalance = await web3.eth.getBalance(this.account)
    this.querySelector('[data-output-balance]').innerText = `${web3.utils.fromWei(ownerBalance)} ETH`

    const balances = await this.contract.getAssociatesWithBalance()

    const list = this.querySelector('[data-events-list]')
    list.innerHTML = ''
    balances
      .map(balanceData => htmlToElement(`<div class="item">${balanceData.address} - ${web3.utils.fromWei(balanceData.balance)} ETH</div>`))
      .forEach(element => {
        list.appendChild(element)
      })
  }
}

window.customElements.define('eth-company', CompanyApp)
