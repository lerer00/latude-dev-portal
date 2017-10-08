pragma solidity ^0.4.13;
import "./Property.sol";

contract PropertyFactory {
    address[] propertyAddress;

    function PropertyFactory() payable {
    }

    function createProperty(string name, string country, string city) returns (address) {
        address newProperty = (new Property).value(1000000000000000000)(name, country, city);
        propertyAddress.push(newProperty);

        return newProperty;
    }

    function getProperties() constant returns(address[]) {
        return propertyAddress;
    }

    function getBalance() constant returns(uint) {
        return this.balance;
    }
}