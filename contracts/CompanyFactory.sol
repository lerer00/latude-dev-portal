pragma solidity ^0.4.13;
import "./Owned.sol";
import "./Company.sol";

contract CompanyFactory is Owned {
    address[] compagnies;

    function CompanyFactory() payable {
    }

    function createCompany(string name) returns (address) {
        address newCompany = (new Company).value(1000000000000000000)(name);
        compagnies.push(newCompany);

        return newCompany;
    }

    function getCompanies() constant returns(address[]) {
        return compagnies;
    }

    function getBalance() constant returns(uint) {
        return this.balance;
    }
}