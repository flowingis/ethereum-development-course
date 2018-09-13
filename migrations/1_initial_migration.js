const Migrations = artifacts.require('./Migrations.sol')
const SecureCounter = artifacts.require('./SecureCounter.sol')

module.exports = function (deployer) {
  deployer.deploy(Migrations)
  deployer.deploy(SecureCounter)
}
