pragma solidity ^0.4.13;
import "./Company.sol";

contract CompanyFactory {
    address[] companyAddress;

    function CompanyFactory() payable {
    }

    function createCompany(string name) returns (address) {
        address newCompany = (new Company).value(1000000000000000000)(name);
        companyAddress.push(newCompany);

        return newCompany;
    }

    function getCompanies() constant returns(address[]) {
        return companyAddress;
    }

    function getBalance() constant returns(uint) {
        return this.balance;
    }
}