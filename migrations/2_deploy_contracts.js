var ExchangeRates = artifacts.require("./ExchangeRates.sol");
var CompanyFactory = artifacts.require("./CompanyFactory.sol");

module.exports = function (deployer) {
  deployer.deploy(ExchangeRates, { value: 1000000000000000000 }).then(() => {
    // after deployment, we need the address to create the CompanyFactory contract
    var exchangeRatesAfterBuild = artifacts.require("./ExchangeRates.sol");
    for (var obj in exchangeRatesAfterBuild.networks) {
      var exchangeRatesContractAddress = exchangeRatesAfterBuild.networks[obj].address;

      // deploy the CompanyFactory contract with a fresh exchange.
      deployer.deploy(CompanyFactory, exchangeRatesContractAddress);
      
      break;
    }
  });
};
