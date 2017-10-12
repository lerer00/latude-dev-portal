pragma solidity ^0.4.13;
import "./Owned.sol";
import "./Property.sol";

contract Company is Owned {
    string name;
    address[] properties;

    function Company(string n) payable {
        name = n;
    }

    function createProperty(string n) returns (address) {
        address newProperty = (new Property).value(100000000000000000)(n);
        properties.push(newProperty);

        return newProperty;
    }

    function getName() constant returns (string) {
        return name;
    }

    function getProperties() constant returns(address[]) {
        return properties;
    }

    function getBalance() constant returns(uint) {
        return this.balance;
    }
}