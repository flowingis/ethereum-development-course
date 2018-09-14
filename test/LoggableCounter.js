const LoggableCounter = artifacts.require('./LoggableCounter.sol')

contract('LoggableCounter', (accounts) => {
  let owner
  let contract

  beforeEach(async () => {
    owner = accounts[0]
    contract = await LoggableCounter.new({ from: owner })
  })

  it('increment should emit a Increment event, with the value of the counter', async () => {
    await contract.increment({ from: owner })
    await contract.increment({ from: owner })
    await contract.increment({ from: owner })
    const result = await contract.increment({ from: owner })

    const log = result.logs.find(log => log.event === 'Increment')

    assert.isOk(log)
    assert.equal(log.args.value.toNumber(), 4)
  })

  it('reset should emit a Reset event', async () => {
    const result = await contract.reset({ from: owner })

    const log = result.logs.find(log => log.event === 'Reset')

    assert.isOk(log)
  })
})
