pragma solidity ^0.4.15;

import "./Ownable.sol";
import "./Company.sol";

contract CompanyFactory is Ownable {
    mapping(address => address[]) companies;

    function addCompany(string _name) returns (Company) {      
        // Add a new company contract.
        Company newCompany = new Company(_name, msg.sender);
        
        // Add the new one.
        companies[msg.sender].push(newCompany);

        return newCompany;
    }

    function getCompanies() constant returns(address[]) {
        return companies[msg.sender];
    }
}