var CompanyFactory = artifacts.require("./CompanyFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(CompanyFactory, { value: 20000000000000000000 });
};
