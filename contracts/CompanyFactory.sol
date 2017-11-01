pragma solidity ^0.4.17;

import "./Ownable.sol";
import "./Company.sol";

contract CompanyFactory is Ownable {
    mapping(address => address[]) companies;

    function addCompany(string _name) public{      
        // Add a new company contract.
        Company newCompany = new Company(_name, msg.sender);
        
        // Add the new one.
        companies[msg.sender].push(newCompany);
    }

    function getCompanies() public view returns(address[]) {
        return companies[msg.sender];
    }
}