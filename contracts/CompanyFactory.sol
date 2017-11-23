pragma solidity ^0.4.18;

import "./Company.sol";

contract CompanyFactory {
    address public exchangeContract;
    event companyCreated (string name);
    mapping(address => address[]) companies;

    function CompanyFactory(address _exchangeContract) public {
        exchangeContract = _exchangeContract;
    }

    function addCompany(string name) public {
        // Create new company.
        Company newCompany = new Company(name, msg.sender, exchangeContract);

        // Companies are added under a single owner.
        companies[msg.sender].push(newCompany);
        companyCreated(_name);
    }

    function getCompanies() public view returns(address[]) {
        return companies[msg.sender];
    }
}