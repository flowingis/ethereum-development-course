import truffleContract from 'truffle-contract'
import get from 'lodash.get'
import { web3ProviderFix } from 'apps/utils'
import tokenArtifact from '../../build/contracts/SimpleToken.json'
import convertLibArtifact from '../../build/contracts/ConvertLib.json'

const ConvertLib = truffleContract(convertLibArtifact)
const SimpleToken = truffleContract(tokenArtifact)

export default web3 => {
  SimpleToken.setProvider(web3.currentProvider)
  ConvertLib.setProvider(web3.currentProvider)
  web3ProviderFix(SimpleToken)
  web3ProviderFix(ConvertLib)

  let eventListeners = []
  let contract

  const notify = (err, result) => {
    if (err) {
      return
    }

    const receiver = get(result, 'args.receiver')

    eventListeners.forEach(cb => cb(receiver))
  }

  const addEventListener = cb => {
    eventListeners.push(cb)
    return () => {
      eventListeners = eventListeners.filter(toCheck => toCheck !== cb)
    }
  }

  const deploy = async address => {
    const gasPrice = await web3.eth.getGasPrice()

    const lib = await ConvertLib.new({
      from: address,
      gas: 4712388,
      gasPrice
    })

    SimpleToken.setNetwork(web3.eth.net.getId())
    SimpleToken.link('ConvertLib', lib.address)

    contract = await SimpleToken.new({
      from: address,
      gas: 4712388,
      gasPrice
    })

    const transferEvent = contract.Transfer()

    transferEvent.watch(notify)
  }

  const connect = async address => {
    contract = await SimpleToken.at(address)
  }

  const transfer = async ({ sender, receiver, amount }) => {
    const gas = await contract.transfer.estimateGas(receiver, amount)
    const gasPrice = await web3.eth.getGasPrice()

    return contract.transfer(receiver, amount, {
      from: sender,
      gas,
      gasPrice
    })
  }

  const getBalance = async (address) => {
    const balance = await contract.getBalance(address)
    const balanceInEth = await contract.getBalanceInEth(address)
    return {
      address,
      balance,
      balanceInEth
    }
  }

  const getBalances = async (adresses = []) => {
    const list = []
    for (let index = 0; index < adresses.length; index++) {
      const balance = await getBalance(adresses[index])
      list.push(balance)
    }
    return list
  }

  return {
    get address () {
      return contract.address
    },
    transfer,
    connect,
    deploy,
    getBalance,
    getBalances,
    addEventListener
  }
}
