const Poll = artifacts.require('./Poll.sol')

const RESULT_TYPES = {
  DRAW: 0,
  FAVORABLE: 1,
  NOT_FAVORABLE: 2
}

contract('Poll', (accounts) => {
  let owner
  let contract
  let firstVoter
  let secondVoter

  beforeEach(async () => {
    owner = accounts[0]
    firstVoter = accounts[1]
    secondVoter = accounts[2]
    contract = await Poll.new({ from: owner })
  })

  it('only the owner should be able to start the poll', async () => {
    try {
      await contract.start({ from: firstVoter })
      assert.fail()
    } catch (e) {
      assert.isOk(e)
    }

    try {
      await contract.start({ from: owner })
    } catch (e) {
      assert.fail()
    }
  })

  it('only the owner should be able to stop the poll', async () => {
    await contract.start({ from: owner })

    try {
      await contract.stop({ from: firstVoter })
      assert.fail()
    } catch (e) {
      assert.isOk(e)
    }

    try {
      await contract.stop({ from: owner })
    } catch (e) {
      assert.fail()
    }
  })

  it('shoud not be possible to vote before the poll started', async () => {
    try {
      await contract.vote(true, { from: firstVoter })
      assert.fail()
    } catch (e) {
      assert.isOk(e)
    }
  })

  it('shoud not be possible to vote after the poll stopped', async () => {
    await contract.start({ from: owner })
    await contract.stop({ from: owner })
    try {
      await contract.vote(true, { from: firstVoter })
      assert.fail()
    } catch (e) {
      assert.isOk(e)
    }
  })

  it("should return 'DRAW' if each side has the same number of votes", async () => {
    await contract.start({ from: owner })

    await contract.vote(true, { from: firstVoter })
    await contract.vote(false, { from: secondVoter })

    await contract.stop({ from: owner })

    const result = await contract.result()

    assert.equal(result.valueOf(), RESULT_TYPES.DRAW)
  })

  it("should return 'FAVORABLE' if the favorable side has the majority of the votes", async () => {
    await contract.start({ from: owner })

    await contract.vote(true, { from: firstVoter })
    await contract.vote(true, { from: secondVoter })

    await contract.stop({ from: owner })

    const result = await contract.result()

    assert.equal(result.valueOf(), RESULT_TYPES.FAVORABLE)
  })

  it("should return 'NOT_FAVORABLE' if the favorable side has the majority of the votes", async () => {
    await contract.start({ from: owner })

    await contract.vote(false, { from: firstVoter })
    await contract.vote(false, { from: secondVoter })

    await contract.stop({ from: owner })

    const result = await contract.result()

    assert.equal(result.valueOf(), RESULT_TYPES.NOT_FAVORABLE)
  })

  it('should not count more than one vote from the same address', async () => {
    await contract.start({ from: owner })

    contract.vote(true, { from: firstVoter })
    contract.vote(false, { from: secondVoter })
    contract.vote(true, { from: secondVoter })

    await contract.stop({ from: owner })

    const result = await contract.result()

    assert.equal(result.valueOf(), RESULT_TYPES.DRAW)
  })
})
