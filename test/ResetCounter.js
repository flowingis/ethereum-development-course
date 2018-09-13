const ResetCounter = artifacts.require('./ResetCounter.sol')

contract('ResetCounter', () => {
  let contract

  beforeEach(async () => {
    contract = await ResetCounter.new()
  })

  it('reset should reset counter', async () => {
    await contract.increment()
    await contract.reset()
    const value = await contract.counter()
    assert.equal(value.valueOf(), 0)
  })
})
