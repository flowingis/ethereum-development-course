import truffleContract from 'truffle-contract'
import get from 'lodash.get'
import { web3ProviderFix } from 'apps/utils'
import tokenArtifact from '../../build/contracts/TutorialToken.json'

const TutorialToken = truffleContract(tokenArtifact)

export default web3 => {
  TutorialToken.setProvider(web3.currentProvider)
  web3ProviderFix(TutorialToken)

  let eventListeners = []
  let contract

  const notify = (err, result) => {
    if (err) {
      return
    }

    const to = get(result, 'args.to')

    eventListeners.forEach(cb => cb(to))
  }

  const addEventListener = cb => {
    eventListeners.push(cb)
    return () => {
      eventListeners = eventListeners.filter(toCheck => toCheck !== cb)
    }
  }

  const deploy = async address => {
    const gasPrice = await web3.eth.getGasPrice()

    contract = await TutorialToken.new({
      from: address,
      gas: 4712388,
      gasPrice
    })

    const transferEvent = contract.Transfer()

    transferEvent.watch(notify)
  }

  const connect = async address => {
    contract = await TutorialToken.at(address)
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

  const move = async ({ sender, receiver, amount }) => {
    const gasPrice = await web3.eth.getGasPrice()

    let gas = await contract.approve.estimateGas(sender, amount)
    await contract.approve(sender, amount, {
      from: sender,
      gas,
      gasPrice
    })

    gas = await contract.transferFrom.estimateGas(sender, receiver, amount)

    return contract.transferFrom(sender, receiver, amount, {
      from: sender,
      gas,
      gasPrice
    })
  }

  const getBalance = async (address) => {
    const balance = await contract.balanceOf(address)
    return {
      address,
      balance
    }
  }

  const getTokenInfo = async (owner) => {
    const name = await contract.name()
    const symbol = await contract.symbol()
    const totalSupply = await contract.totalSupply()
    const { balance } = await getBalance(owner)

    return {
      name,
      symbol,
      totalSupply,
      balance
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
    getTokenInfo,
    move,
    addEventListener
  }
}
