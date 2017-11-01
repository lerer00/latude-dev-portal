var CompanyFactory = artifacts.require("./CompanyFactory.sol");

module.exports = function (deployer) {
  deployer.deploy(CompanyFactory);
};
