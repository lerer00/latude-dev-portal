var CompanyFactory = artifacts.require("CompanyFactory.sol");

contract("CompanyFactory", function(addresses) {
	it("should initially have empty array of companies", async function() {
		var cfInstance = await CompanyFactory.deployed();
		var companies = await cfInstance.getCompanies.call();

		assert.equal(companies.length, 0, "array isn't empty");
	});
	it("should create new Company properly", async function() {
		var companyName = "AliceCompany";
		var cfInstance = await CompanyFactory.deployed();
		var companyAddress = await cfInstance.createCompany.call(companyName);
		var companies = await cfInstance.getCompanies.call();

		assert.equal(isAddress(companyAddress), true, "not an Ethereum address");
		assert.equal(companies.length, 1, "company instance isn't created");
	});
})

function isAddress(input) {
	if(/0x[0-9A-Fa-f]{40}/g.test(input)) {
		return true;
	} else {
	 	return false;
	}
}