const ConvertLib = artifacts.require('./ConvertLib.sol')
const BasicToken = artifacts.require('./BasicToken.sol')
const TutorialToken = artifacts.require('./TutorialToken.sol')

module.exports = deployer => {
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, BasicToken)
  deployer.deploy(BasicToken)
  deployer.deploy(TutorialToken)
}
