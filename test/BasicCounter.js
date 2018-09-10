
const BasicCounter = artifacts.require('./BasicCounter.sol')

contract('BasicCounter', () => {
  let contract

  beforeEach(async () => {
    contract = await BasicCounter.new()
  })

  it("counter should start with 0", async () => {
    const value = await contract.counter()
    assert.equal(value.valueOf(), 0)
  })

  it("increment should increment counter", async () => {
    await contract.increment()
    const value = await contract.counter()
    assert.equal(value.valueOf(), 1)
  })
})