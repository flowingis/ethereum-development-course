const ConvertLib = artifacts.require('./ConvertLib.sol')
const SimpleToken = artifacts.require('./SimpleToken.sol')
const TutorialToken = artifacts.require('./TutorialToken.sol')
const ITO = artifacts.require('./ITO.sol')

module.exports = async deployer => {
  await deployer.deploy(ConvertLib)
  await deployer.link(ConvertLib, SimpleToken)
  await deployer.deploy(SimpleToken)
  const token = await deployer.deploy(TutorialToken)
  const ito = await deployer.deploy(ITO, TutorialToken.address)

  await token.transfer(ito.address, 20000)
}
