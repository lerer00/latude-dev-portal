var ExchangeRates = artifacts.require("./ExchangeRates.sol");
var CompanyFactory = artifacts.require("./CompanyFactory.sol");

module.exports = function (deployer) {
  // this is not working since the network property within the /build/contracts/CompanyFactory.sol
  // is not populated correctly. Maybe a truffle or something I've missed since it's working when
  // I do them side by side...

  // deployer.deploy(ExchangeRates, { value: 1000000000000000000 }).then(() => {
  //   // after deployment, we need the address to create the CompanyFactory contract
  //   var exchangeRatesAfterBuild = artifacts.require("./ExchangeRates.sol");
  //   for (var obj in exchangeRatesAfterBuild.networks) {
  //     var exchangeRatesContractAddress = exchangeRatesAfterBuild.networks[obj].address;

  //     // deploy the CompanyFactory contract with a fresh exchange.
  //     console.log('This is the one: ' + exchangeRatesContractAddress);
  //     deployer.deploy(CompanyFactory);

  //     break;
  //   }
  // });


  // exchange need to be passed manually, this is shit...
  deployer.deploy(CompanyFactory, "0x746535b7e5b157aee6e83eee76420d5130cf90dc");
};
