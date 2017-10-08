pragma solidity ^0.4.13;

contract Company {
    string Name;

    function Company(string name) payable {
        Name = name;
    }

    function getName() constant returns (string) {
        return Name;
    }

    function getBalance() constant returns(uint) {
        return this.balance;
    }
}