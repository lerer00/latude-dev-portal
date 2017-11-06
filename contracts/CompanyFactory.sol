pragma solidity ^0.4.17;

import "./Ownable.sol";
import "./Company.sol";

contract CompanyFactory is Ownable {
    address exchangeContract;
    mapping(address => address[]) companies;

    function CompanyFactory(address _exchangeContract) public {
        exchangeContract = _exchangeContract;
    }

    function addCompany(string _name) public{      
        Company newCompany = new Company(_name, msg.sender, exchangeContract);

        // companies are added under a single address
        companies[msg.sender].push(newCompany);
    }

    function getCompanies() public view returns(address[]) {
        return companies[msg.sender];
    }
}