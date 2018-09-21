const SimpleToken = artifacts.require('./SimpleToken.sol')

contract('SimpleToken', (accounts) => {
  let contract
  let owner
  let receiver

  const TOKEN_TO_SEND = 10

  beforeEach(async () => {
    [owner, receiver] = accounts
    contract = await SimpleToken.new({ from: owner })
  })

  it('should put 10000 SimpleToken in the first account', async () => {
    const balance = await contract.getBalance(owner)
    assert.equal(balance.valueOf(), 10000)
  })

  it('should call a function that depends on a linked library', async () => {
    const simpleTokenBalance = (await contract.getBalance(owner)).toNumber()
    const simpleTokenEthBalance = (await contract.getBalanceInEth(owner)).toNumber()

    assert.equal(simpleTokenEthBalance, 2 * simpleTokenBalance, 'Library function returned unexpected function, linkage may be broken')
  })

  it('should send coin correctly', async () => {
    const firstAccoutInitialBalance = (await contract.getBalance(owner)).toNumber()
    const secondAccountInitialBalance = (await contract.getBalance(receiver)).toNumber()

    await contract.transfer(receiver, TOKEN_TO_SEND, { from: owner })

    const firstAccountFinalBalance = (await contract.getBalance(owner)).toNumber()
    const secondAccountFinalBalance = (await contract.getBalance(receiver)).toNumber()

    assert.equal(firstAccountFinalBalance, firstAccoutInitialBalance - TOKEN_TO_SEND, "Amount wasn't correctly taken from the sender")
    assert.equal(secondAccountFinalBalance, secondAccountInitialBalance + TOKEN_TO_SEND, "Amount wasn't correctly sent to the receiver")
  })
})
