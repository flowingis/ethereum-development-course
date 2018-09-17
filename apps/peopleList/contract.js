import truffleContract from 'truffle-contract'
import { web3ProviderFix } from 'apps/utils'
import artifact from '../../build/contracts/PeopleList.json'
const PeopleList = truffleContract(artifact)

export default web3 => {
  PeopleList.setProvider(web3.currentProvider)
  web3ProviderFix(PeopleList)

  let contract

  const deploy = async address => {
    contract = await PeopleList.new({
      from: address,
      gas: 4712388
    })
  }

  const connect = async address => {
    contract = await PeopleList.at(address)
  }

  const add = async ({ address, person }) => {
    const { name, birthdate, sex } = person

    const gas = await contract.add.estimateGas(name, birthdate, sex)

    return contract.add(name, birthdate, sex, {
      from: address,
      gas
    })
  }

  const list = async () => {
    const list = []
    const counter = await contract.getCount()
    for (let index = 0; index < counter; index++) {
      const [name, birthdate, sex] = await contract.get(index)
      list.push({
        name,
        sex,
        birthdate: birthdate.toNumber()
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
    list
  }
}
