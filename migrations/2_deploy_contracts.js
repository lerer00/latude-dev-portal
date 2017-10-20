var CompanyFactory = artifacts.require("./CompanyFactory.sol");

module.exports = function(deployer) {
  // deployer.deploy(CompanyFactory, { value: 10000000000000000000 });
  deployer.deploy(CompanyFactory);
};
