import truffleContract from 'truffle-contract'
import get from 'lodash.get'
import { web3ProviderFix } from 'apps/utils'
import ITOArtifact from '../../build/contracts/ITO.json'
import tokenArtifact from '../../build/contracts/TutorialToken.json'

const TutorialToken = truffleContract(tokenArtifact)
const ITO = truffleContract(ITOArtifact)

export default web3 => {
  ITO.setProvider(web3.currentProvider)
  TutorialToken.setProvider(web3.currentProvider)
  web3ProviderFix(ITO)
  web3ProviderFix(TutorialToken)

  let eventListeners = []
  let contract
  let token

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

  const deploy = async (address) => {
    const gasPrice = await web3.eth.getGasPrice()

    token = await TutorialToken.new({
      from: address,
      gas: 4712388,
      gasPrice
    })

    contract = await ITO.new(token.address, {
      from: address,
      gas: 4712388,
      gasPrice
    })

    const totalSupply = await token.totalSupply()

    const gas = await token.transfer.estimateGas(contract.address, totalSupply)

    await token.transfer(contract.address, totalSupply, {
      from: address,
      gas,
      gasPrice
    })

    const purchaseEvent = contract.Purchase()

    purchaseEvent.watch(notify)
  }

  const connect = async address => {
    contract = await ITO.at(address)
    const tokenAddress = await contract.tokenAddress()
    token = await TutorialToken.at(tokenAddress)
  }

  const purchase = async ({ receiver, amount }) => {
    const gas = await contract.purchase.estimateGas()
    const gasPrice = await web3.eth.getGasPrice()

    return contract.purchase({
      from: receiver,
      value: amount,
      gas: Math.floor(gas * 1.5),
      gasPrice
    })
  }

  const start = async (address) => {
    const gas = await contract.start.estimateGas()
    const gasPrice = await web3.eth.getGasPrice()

    return contract.start({
      from: address,
      gas: Math.floor(gas * 1.5),
      gasPrice
    })
  }

  const stop = async (address) => {
    const gas = await contract.stop.estimateGas()
    const gasPrice = await web3.eth.getGasPrice()

    return contract.stop({
      from: address,
      gas: Math.floor(gas * 1.5),
      gasPrice
    })
  }

  const getTokensLeft = async () => getBalance(contract.address)

  const getBalance = async (address) => token.balanceOf(address)

  const getStatus = async () => {
    const started = await contract.started()
    if (!started) {
      return 'Not Started'
    }

    const stopped = await contract.stopped()

    if (stopped) {
      return 'Stopped'
    }

    return 'Started'
  }

  return {
    get address () {
      return contract.address
    },
    purchase,
    connect,
    deploy,
    getBalance,
    addEventListener,
    start,
    stop,
    getStatus,
    getTokensLeft
  }
}
