var ExchangeRates = artifacts.require("./ExchangeRates.sol");
var CompanyFactory = artifacts.require("./CompanyFactory.sol");
var Company = artifacts.require("./Company.sol");
var Property = artifacts.require("./Property.sol");

module.exports = function (deployer) {
  deployer.deploy(ExchangeRates).then(() => {
    return deployer.deploy(CompanyFactory, ExchangeRates.address);
  });
};
