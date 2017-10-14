pragma solidity ^0.4.15;

import "./Ownable.sol";

contract Property is Ownable {
    string public name;
    uint public numberOfAssets;
    mapping(uint => Asset) public assets;


    struct Asset {
        string name;
        uint price;
    }

    function Property(string _name, address _owner) payable {
        // owner of this Property = person who owns the company that Property is associated with
        transferOwnership(_owner);
        name = _name;
        numberOfAssets = 0;
    }

    function createAsset(string _name, uint _price) onlyOwner returns (address) {
        assets[numberOfAssets++] = Asset(_name, _price);
    }

    function getAsset(uint _id) constant returns (string, uint) {
        return (assets[_id].name, assets[_id].price);
    }    

    function getBalance() constant returns(uint) {
        return this.balance;
    }
}