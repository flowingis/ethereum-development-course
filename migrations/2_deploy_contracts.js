const ConvertLib = artifacts.require('./ConvertLib.sol')
const BasicToken = artifacts.require('./BasicToken.sol')

module.exports = deployer => {
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, BasicToken)
  deployer.deploy(BasicToken)
}
