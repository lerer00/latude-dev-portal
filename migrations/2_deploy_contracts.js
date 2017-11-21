var ExchangeRates = artifacts.require("./ExchangeRates.sol");
var CompanyFactory = artifacts.require("./CompanyFactory.sol");
var Company = artifacts.require("./Company.sol");
var Property = artifacts.require("./Property.sol");
var Ownable = artifacts.require("./Ownable.sol");

module.exports = function (deployer) {
  console.log(deployer);
  deployer.deploy(ExchangeRates, { value: 1000000000000000000 }).then(() => {
    return deployer.deploy(CompanyFactory, ExchangeRates.address);
  }).then(() => {
    return deployer.deploy(Company, "hilton", "0xbB27c74Cf46C7A418484824E4A1515435b084F32", ExchangeRates.address);
  }).then(() => {
    return deployer.deploy(Property, "monterey", "0xbB27c74Cf46C7A418484824E4A1515435b084F32", ExchangeRates.address);
  }).then(() => {
    return deployer.deploy(Ownable);
  });
};
