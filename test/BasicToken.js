const BasicToken = artifacts.require('./BasicToken.sol')

contract('BasicToken', (accounts) => {
  let contract
  let owner
  let receiver
  let poorSender

  const TOKEN_TO_SEND = 10

  beforeEach(async () => {
    [owner, receiver, poorSender] = accounts
    contract = await BasicToken.new({ from: owner })
  })

  it('should put 10000 BasicToken in the first account', async () => {
    const balance = await contract.getBalance(owner)
    assert.equal(balance.valueOf(), 10000)
  })

  it('should call a function that depends on a linked library', async () => {
    const basicTokenBalance = (await contract.getBalance(owner)).toNumber()
    const basicTokenEthBalance = (await contract.getBalanceInEth(owner)).toNumber()

    assert.equal(basicTokenEthBalance, 2 * basicTokenBalance, 'Library function returned unexpected function, linkage may be broken')
  })

  it('should send coin correctly', async () => {
    const AMOUNT = 10

    const firstAccoutInitialBalance = (await contract.getBalance(owner)).toNumber()
    const secondAccountInitialBalance = (await contract.getBalance(receiver)).toNumber()

    await contract.sendCoin(receiver, AMOUNT, { from: owner })

    const firstAccountFinalBalance = (await contract.getBalance(owner)).toNumber()
    const secondAccountFinalBalance = (await contract.getBalance(receiver)).toNumber()

    assert.equal(firstAccountFinalBalance, firstAccoutInitialBalance - AMOUNT, "Amount wasn't correctly taken from the sender")
    assert.equal(secondAccountFinalBalance, secondAccountInitialBalance + AMOUNT, "Amount wasn't correctly sent to the receiver")
  })

  it('should emit a Transfer when the transaction is valid', async () => {
    const result = await contract.sendCoin(receiver, TOKEN_TO_SEND, { from: owner })

    const log = result.logs.find(log => log.event === 'Transfer')
    assert.isOk(log)
  })

  it('should not emit a Transfer when the transaction is not valid', async () => {
    const result = await contract.sendCoin(receiver, TOKEN_TO_SEND, { from: poorSender })

    const log = result.logs.find(log => log.event === 'Transfer')
    assert.isNotOk(log)
  })
})
