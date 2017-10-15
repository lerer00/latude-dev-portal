pragma solidity ^0.4.15;

import "./Ownable.sol";
import "./Company.sol";

contract CompanyFactory is Ownable {
    address[] public companies;

    function CompanyFactory() payable {}

    function createCompany(string _name) returns (Company) {
        Company newCompany = (new Company).value(10000000000000000000)(_name, msg.sender);
        companies.push(newCompany);

        return newCompany;
    }

    function getCompanies() constant returns(address[]) {
        return companies;
    }

    function getBalance() constant returns(uint) {
        return this.balance;
    }
}