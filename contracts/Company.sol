pragma solidity ^0.4.17;

import "./Ownable.sol";
import "./Property.sol";

contract Company is Ownable {
    string public name;
    address public exchangeContract;
    address[] public properties;

    function Company(string _name, address _owner, address _exchangeContract) public payable {
        transferOwnership(_owner);
        name = _name;
        exchangeContract = _exchangeContract;
    }

    function addProperty(string _name) onlyOwner public returns (Property) {
        Property newProperty = new Property(_name, owner, exchangeContract);
        properties.push(newProperty);
        return newProperty;
    }

    function getProperties() public view returns(address[]) {
        return properties;
    }
}