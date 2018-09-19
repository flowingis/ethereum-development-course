import truffleContract from 'truffle-contract'
import { web3ProviderFix } from 'apps/utils'
import artifact from '../../build/contracts/Company.json'
const Company = truffleContract(artifact)

export default web3 => {
  Company.setProvider(web3.currentProvider)
  web3ProviderFix(Company)

  let contract

  const deploy = async address => {
    const gasPrice = await web3.eth.getGasPrice()
    contract = await Company.new({
      from: address,
      gas: 4712388,
      gasPrice
    })
  }

  const connect = async address => {
    contract = await Company.at(address)
  }

  const add = async (owner, address) => {
    const gas = await contract.addAssociate.estimateGas(address)
    const gasPrice = await web3.eth.getGasPrice()

    return contract.addAssociate(address, {
      from: owner,
      gas,
      gasPrice
    })
  }

  const pay = async (from, value) => {
    return contract.pay({
      from,
      value: web3.utils.toWei(value, 'ether')
    })
  }

  const getAssociatesWithBalance = async () => {
    const list = []
    const counter = await contract.getCount()
    for (let index = 0; index < counter; index++) {
      const address = await contract.get(index)
      const balance = await web3.eth.getBalance(address)
      list.push({
        address,
        balance
      })
    }
    return list
  }

  return {
    get address () {
      return contract.address
    },
    connect,
    deploy,
    add,
    pay,
    getAssociatesWithBalance
  }
}
