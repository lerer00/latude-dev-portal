pragma solidity ^0.4.17;

import "./Ownable.sol";
import "./Property.sol";

contract Company is Ownable {
    string public name;
    address[] public properties;

    function Company(string _name, address _owner) public payable {
        transferOwnership(_owner);
        name = _name;
    }

    function addProperty(string _name) onlyOwner public returns (Property) {
        Property newProperty = new Property(_name, owner);
        properties.push(newProperty);

        return newProperty;
    }

    function getProperties() public view returns(address[]) {
        return properties;
    }
}