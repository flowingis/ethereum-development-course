const EmptyContract = artifacts.require('./EmptyContract.sol')

contract('EmptyContract', () => {
  let contract

  beforeEach(async () => {
    contract = await EmptyContract.new()
  })

  it('should work', async () => {
    assert.isOk(contract)
  })
})
