
const ResetCounter = artifacts.require('./ResetCounter.sol')

contract('ResetCounter', () => {
  let contract

  beforeEach(async () => {
    contract = await ResetCounter.new()
  })

  it('counter should start with 0', async () => {
    const value = await contract.counter()
    assert.equal(value.valueOf(), 0)
  })

  it('increment should increment counter', async () => {
    await contract.increment()
    const value = await contract.counter()
    assert.equal(value.valueOf(), 1)
  })

  it('reset should reset counter', async () => {
    await contract.increment()
    await contract.reset()
    const value = await contract.counter()
    assert.equal(value.valueOf(), 0)
  })
})
