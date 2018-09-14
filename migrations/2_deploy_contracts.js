const ConvertLib = artifacts.require('./ConvertLib.sol')
const SimpleToken = artifacts.require('./SimpleToken.sol')
const TutorialToken = artifacts.require('./TutorialToken.sol')

module.exports = deployer => {
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, SimpleToken)
  deployer.deploy(SimpleToken)
  deployer.deploy(TutorialToken)
}
