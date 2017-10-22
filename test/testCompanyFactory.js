var CompanyFactory = artifacts.require("CompanyFactory.sol");

contract("CompanyFactory", function (accounts) {
	it("should initially have empty array of companies", function () {
		return CompanyFactory.deployed().then(function (instance) {
			return instance.getCompanies.call();
		}).then(function (companies) {
			assert.equal(companies.length, 0, "array isn't empty");
		});
	});
	it("should add new Company properly", function () {
		var tmpInstance;
		var companyName = "AliceCompany";
		return CompanyFactory.deployed().then(function (instance) {
			tmpInstance = instance;
			return tmpInstance.addCompany(companyName, { from: accounts[0] });
		}).then(function (address) {
			return tmpInstance.getCompanies.call();
		}).then(function (companies) {
			assert.equal(companies.length, 1, "company instance isn't added");
		});
	});
})

function isAddress(input) {
	if (/0x[0-9A-Fa-f]{40}/g.test(input)) {
		return true;
	} else {
		return false;
	}
}