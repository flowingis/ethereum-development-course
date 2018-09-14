const PeopleList = artifacts.require('./PeopleList.sol')

const extractPersonFromResult = result => {
  const { name, birthdate, sex } = result
  return {
    name,
    sex,
    birthdate: birthdate.toNumber()
  }
}

contract('PeopleList', () => {
  let contract

  beforeEach(async () => {
    contract = await PeopleList.new()
  })

  it('should start with an empty list', async () => {
    const value = await contract.getCount()
    assert.equal(value.toNumber(), 0)
  })

  it('shoud add an element to the list', async () => {
    await contract.add('Solid Snake', 63072000, 'm')
    const count = await contract.getCount()
    assert.equal(count.toNumber(), 1)
  })

  it('shoud retrieve an element from the list', async () => {
    await contract.add('Solid Snake', 63072000, 'm')
    const person = await contract.get(0)

    const EXPECTATION = {
      name: 'Solid Snake',
      birthdate: 63072000,
      sex: 'm'
    }

    assert.deepEqual(extractPersonFromResult(person), EXPECTATION)
  })
})
