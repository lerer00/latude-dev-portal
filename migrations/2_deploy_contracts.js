var PropertyFactory = artifacts.require("./PropertyFactory.sol");
var CompanyFactory = artifacts.require("./CompanyFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(PropertyFactory, { value: 5000000000000000000 });
  deployer.deploy(CompanyFactory, { value: 5000000000000000000 });
};
