var PropertyFactory = artifacts.require("./PropertyFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(PropertyFactory, { value: 10000000000000000000 });
};
