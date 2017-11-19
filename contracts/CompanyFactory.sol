pragma solidity ^0.4.17;

import "./Ownable.sol";
import "./Company.sol";

contract CompanyFactory is Ownable {
    address public exchangeContract;
    mapping(address => address[]) companies;

    function CompanyFactory(address _exchangeContract) public {
        exchangeContract = _exchangeContract;
    }

    function addCompany(string name) public {
        // Validate that name is not empty.
        require(bytes(name).length > 0);

        Company newCompany = new Company(name, msg.sender, exchangeContract);

        // Companies are added under a single owner.
        companies[msg.sender].push(newCompany);
    }

    function getCompanies() public view returns(address[]) {
        return companies[msg.sender];
    }
}