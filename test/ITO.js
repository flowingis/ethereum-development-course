const SimpleToken = artifacts.require('./TutorialToken.sol')
const ITO = artifacts.require('./ITO.sol')

contract('ITO', (accounts) => {
  let contract
  let baker
  let owner
  let token

  beforeEach(async () => {
    [
      owner,
      baker
    ] = accounts
    token = await SimpleToken.new({ from: owner })
    contract = await ITO.new(token.address, { from: owner })
    const totalSupply = await token.totalSupply()
    await token.transfer(contract.address, totalSupply)
  })

  it('purchase should be permitted only when started', async () => {
    try {
      await contract.purchase({ from: baker, value: 10 })
      assert.fail()
    } catch (e) {
      assert.isOk(e)
    }

    await contract.start({ from: owner })

    try {
      await contract.purchase({ from: baker, value: web3.utils.toWei('1', 'ether') })
    } catch (e) {
      console.log(e)
      assert.fail()
    }
  })

  it('purchase should not be permitted when stopped', async () => {
    await contract.start({ from: owner })
    await contract.stop({ from: owner })
    try {
      await contract.purchase({ from: baker, value: 10 })
      assert.fail()
    } catch (e) {
      assert.isOk(e)
    }
  })

  it('the first 1000 token should cost 0.001 ETH', async () => {
    await contract.start({ from: owner })
    await contract.purchase({ from: baker, value: web3.utils.toWei('1', 'ether') })
    const balance = await token.balanceOf(baker)
    assert.equal(balance, 1000)
  })

  it('a token should cost 0.01 ETH when more then 10000 are left', async () => {
    const token = await SimpleToken.new({ from: owner })
    const contract = await ITO.new(token.address, { from: owner })
    await token.transfer(contract.address, 19000)

    await contract.start({ from: owner })
    await contract.purchase({ from: baker, value: web3.utils.toWei('1', 'ether') })
    const balance = await token.balanceOf(baker)
    assert.equal(balance, 100)
  })

  it('a token should cost 0.1 ETH when more then 1000 are left', async () => {
    const token = await SimpleToken.new({ from: owner })
    const contract = await ITO.new(token.address, { from: owner })
    await token.transfer(contract.address, 10000)

    await contract.start({ from: owner })
    await contract.purchase({ from: baker, value: web3.utils.toWei('1', 'ether') })
    const balance = await token.balanceOf(baker)
    assert.equal(balance, 10)
  })

  it('the last 1000 Token should cost 1 ETH', async () => {
    const token = await SimpleToken.new({ from: owner })
    const contract = await ITO.new(token.address, { from: owner })
    await token.transfer(contract.address, 1000)

    await contract.start({ from: owner })
    await contract.purchase({ from: baker, value: web3.utils.toWei('1', 'ether') })
    const balance = await token.balanceOf(baker)
    assert.equal(balance, 1)
  })
})
