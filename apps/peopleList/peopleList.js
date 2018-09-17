import swal from 'sweetalert2'
import template from './peopleList.html'
import { initWeb3 } from 'apps/utils'
import contractFactory from './contract'

const web3 = initWeb3()

class PeopleListApp extends HTMLElement {
  connectedCallback () {
    this.innerHTML = template
    this.contract = contractFactory(web3)
    this.getAccount()
    this.attachEventListeners()
  }

  async getAccount () {
    [this.account] = await web3.eth.getAccounts()
  }

  attachEventListeners () {
    this.querySelector('[data-deploy]').addEventListener('click', () => {
      this.deploy(this.account)
    })

    this.querySelector('[data-connect]').addEventListener('click', () => {
      this.connect(this.querySelector('[data-input-contract]').value)
    })
  }

  async deploy (owner) {
    try {
      await this.contract.deploy(owner)
      this.querySelector('[data-contract-address]').innerText = this.contract.address
    } catch (e) {
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
    } catch (e) {
      swal({
        title: 'Error!',
        text: e.message,
        type: 'error'
      })
    }
  }
}

window.customElements.define('eth-people-list', PeopleListApp)
