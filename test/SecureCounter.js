const SecureCounter = artifacts.require('./SecureCounter.sol')

contract('SecureCounter', (accounts) => {
  let owner
  let contract
  let anotherAccount

  beforeEach(async () => {
    owner = accounts[0]
    anotherAccount = accounts[1]
    contract = await SecureCounter.new({ from: owner })
  })

  it('reset should be invokable just by the owner', async () => {
    try {
      await contract.reset({ from: anotherAccount })
      assert.fail()
    } catch (e) {
      assert.isOk(e)
    }

    try {
      await contract.reset({ from: owner })
    } catch (e) {
      assert.fail()
    }
  })
})
