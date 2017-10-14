pragma solidity ^0.4.15;

import "./Ownable.sol";
import "./Property.sol";

contract Company is Ownable {
    string public name;
    address[] public properties;

    function Company(string _name, address _owner) payable {
        transferOwnership(_owner);
        name = _name;
    }

    function createProperty(string _name) onlyOwner returns (Property) {
        Property newProperty = (new Property).value(100000000000000000)(_name, owner);
        properties.push(newProperty);

        return newProperty;
    }

    function getProperties() constant returns(address[]) {
        return properties;
    }

    function getBalance() constant returns(uint) {
        return this.balance;
    }
}