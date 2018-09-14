const Company = artifacts.require('./Company.sol')

contract('Company', (accounts) => {
  let contract
  let owner
  let payer
  let associate1
  let associate2

  beforeEach(async () => {
    owner = accounts[0]
    payer = accounts[1]
    associate1 = accounts[2]
    associate2 = accounts[3]
    contract = await Company.new({ from: owner })
  })

  it('addAssociates should be invokable just by the owner', async () => {
    try {
      await contract.addAssociate(associate1, { from: payer })
      assert.fail()
    } catch (e) {
      assert.isOk(e)
    }

    try {
      await contract.addAssociate(associate1, { from: owner })
    } catch (e) {
      assert.fail()
    }
  })

  it('pay should throw when there are no associates', async () => {
    try {
      await contract.pay({ from: payer, value: 10 })
      assert.fail()
    } catch (e) {
      assert.isOk(e)
    }

    try {
      await contract.addAssociate(associate1, { from: owner })
      await contract.pay({ from: payer, value: 10 })
    } catch (e) {
      assert.fail()
    }
  })

  it('pay should divide value within the associates apart form a fee of 1% of the value', async () => {
    await contract.addAssociate(associate1, { from: owner })
    await contract.addAssociate(associate2, { from: owner })

    const associate1InitialBalance = await web3.eth.getBalance(associate1)
    const associate2InitialBalance = await web3.eth.getBalance(associate2)

    await contract.pay({ from: payer, value: web3.utils.toWei('1') })

    const associate1Gain = (await web3.eth.getBalance(associate1)) - associate1InitialBalance
    const associate2Gain = (await web3.eth.getBalance(associate2)) - associate2InitialBalance

    assert.equal(associate1Gain, web3.utils.toWei('0.495'))
    assert.equal(associate2Gain, web3.utils.toWei('0.495'))
  })

  it('the fee should go to the owner', async () => {
    await contract.addAssociate(associate1, { from: owner })

    const associate1InitialBalance = await web3.eth.getBalance(owner)

    await contract.pay({ from: payer, value: web3.utils.toWei('1') })

    const associate1Gain = (await web3.eth.getBalance(owner)) - associate1InitialBalance

    assert.equal(associate1Gain, web3.utils.toWei('0.01'))
  })
})
