pragma solidity ^0.4.13;
import "./Owned.sol";

contract Property is Owned {
    string name;
    uint id;
    mapping(uint => Asset) assets;

    struct Asset {
        uint id;
        string name;
        uint price;
    }

    function Property(string n) payable {
        id = 0;
        name = n;
    }

    function getName() constant returns (string) {
        return name;
    }

    function createAsset(string n, uint p) returns (address) {
        Asset memory myAsset = Asset(id,n,p);
        assets[id] = myAsset;
        id++;
    }

    function getAsset(uint i) constant returns (uint, string, uint) {
        Asset memory myAsset = assets[i];
        return(myAsset.id, myAsset.name, myAsset.price);
    }

    function getId() constant returns (uint) {
        return id;
    }

    function getBalance() constant returns(uint) {
        return this.balance;
    }
}