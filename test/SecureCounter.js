const SecureCounter = artifacts.require('./SecureCounter.sol')

const getAccounts = () => new Promise((resolve, reject) => {
  web3.eth.getAccounts((err, accounts) => {
    if (err) {
      reject(err)
    } else {
      resolve(accounts)
    }
  })
})

contract('SecureCounter', () => {
  let owner
  let contract
  let anotherAccount

  beforeEach(async () => {
    const accounts = await getAccounts()
    owner = accounts[0]
    anotherAccount = accounts[1]
    contract = await SecureCounter.new({ from: owner })
  })

  it('shoudl be invokable just by the owner', async () => {
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
