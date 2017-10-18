pragma solidity ^0.4.15;

import "./Ownable.sol";

contract Property is Ownable {
    string public name;
    Asset[] assets;
    Stay[] stays;

    // startTime and endTime are in Unix format
    struct Stay {
        uint id;
        uint startTime;
        uint endTime;
        address person;
    }

    struct Asset {
        uint id;
        // type of an asset like bed or room
        string category;
        uint price;
        string currency;
        // ids of stays associated with this particular asset
        uint[] stayIds;
    }

    function Property(string _name, address _owner) payable {
        // owner of this Property = person who owns the company that Property is associated with
        transferOwnership(_owner);
        name = _name;
    }

    function createAsset(string _category, uint _price, string _currency) onlyOwner {
        uint newAssetId = assets.length;
        uint[] memory initialStays;
        assets.push(Asset(newAssetId, _category, _price, _currency, initialStays));
    }

    function getAsset(uint _id) constant returns (uint, string, uint, string, uint[]) {
        Asset memory currentAsset = assets[_id];
        return (currentAsset.id, currentAsset.category, currentAsset.price, currentAsset.currency, currentAsset.stayIds);
    }

    // creates new stay for asset at _id
    // IN FUTURE will create a file representing the stay in IPFS and push its hash to the array 
    function createStay(uint _id, uint _startTime, uint _endTime) payable returns(bool) {
        // check if the amount of wei(!) sent is sufficient
        require(msg.value >= assets[_id].price);
        require(_endTime > _startTime);
        // here we need an if statement to check if the time of stay is acceptable
        uint newStayId = stays.length;
        stays.push(Stay(newStayId, _startTime, _endTime, msg.sender));
        Asset currentAsset = assets[_id];
        currentAsset.stayIds.push(newStayId);
    }

    function getStay(uint _id) constant returns(uint, uint, uint, address) {
        Stay memory currentStay = stays[_id];
        return (currentStay.id, currentStay.startTime, currentStay.endTime, currentStay.person);
    }

    function getBalance() constant returns(uint) {
        return this.balance;
    }
}