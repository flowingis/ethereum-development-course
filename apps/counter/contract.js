import truffleContract from 'truffle-contract'
import { web3ProviderFix } from 'apps/utils'
import artifact from '../../build/contracts/LoggableCounter.json'
const LoggableCounter = truffleContract(artifact)

export default web3 => {
  LoggableCounter.setProvider(web3.currentProvider)
  web3ProviderFix(LoggableCounter)

  let eventListeners = []
  let contract

  const notify = event => {
    eventListeners.forEach(cb => cb(event))
  }

  const addEventListener = cb => {
    eventListeners.push(cb)
    return () => {
      eventListeners = eventListeners.filter(toCheck => toCheck !== cb)
    }
  }

  const deploy = async address => {
    contract = await LoggableCounter.new({
      from: address,
      gas: 4712388,
      gasPrice: 100000000000
    })

    const resetEvent = contract.Reset()
    const incrementEvent = contract.Increment()
    const divisibleByTenEvent = contract.DivisibleByTen()

    const onEvent = eventName => () => notify(eventName)

    resetEvent.watch(onEvent('Reset'))
    incrementEvent.watch(onEvent('Increment'))
    divisibleByTenEvent.watch(onEvent('DivisibleByTen'))
  }

  const increment = async address => contract.increment({ from: address })
  const reset = async address => contract.reset({ from: address })
  const getValue = async () => contract.counter()

  return {
    get address () {
      return contract.address
    },
    deploy,
    increment,
    reset,
    getValue,
    addEventListener
  }
}
