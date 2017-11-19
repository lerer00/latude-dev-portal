var ExchangeRates = artifacts.require("./ExchangeRates.sol");
var CompanyFactory = artifacts.require("./CompanyFactory.sol");
var Company = artifacts.require("./Company.sol");
var Property = artifacts.require("./Property.sol");
var Ownable = artifacts.require("./Ownable.sol");

module.exports = function (deployer) {
  // this is not working since the network property within the /build/contracts/CompanyFactory.sol
  // is not populated correctly. Maybe in truffle or something I've missed since it's working when
  // I do them side by side...

  //deployer.deploy(ExchangeRates, { value: 1000000000000000000 }).then((instance) => {
    // Since we need to deploy the ExchangeRates contract first we need his address.

    // ExchangeRates.deployed().then((instance) => {
    //   deployer.deploy(CompanyFactory, instance.address);
    //   deployer.deploy(Company, "hilton", "0xbB27c74Cf46C7A418484824E4A1515435b084F32", instance.address);
    //   deployer.deploy(Property, "monterey", "0xbB27c74Cf46C7A418484824E4A1515435b084F32", instance.address);
    // });
  //});

  // 0x746535b7e5b157aee6e83eee76420d5130cf90dc is the default first address when deploying ExchangeRates.sol into Remix.
  deployer.deploy(CompanyFactory, "0x746535b7e5b157aee6e83eee76420d5130cf90dc");
  deployer.deploy(Company, "hilton", "0xbB27c74Cf46C7A418484824E4A1515435b084F32", "0x746535b7e5b157aee6e83eee76420d5130cf90dc");
  deployer.deploy(Property, "monterey", "0xbB27c74Cf46C7A418484824E4A1515435b084F32", "0x746535b7e5b157aee6e83eee76420d5130cf90dc");
  deployer.deploy(Ownable);
};
