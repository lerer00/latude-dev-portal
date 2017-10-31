pragma solidity ^0.4.15;

import "./Ownable.sol";

contract Property is Ownable {
    string public name;
    Asset[] assets;
    mapping(uint => Stays) stays;
    
    // this is to bypass the problem related to copying memory struct arrays to storage
    struct Stays {
        Stay[] stays;
    }

    // startTime and endTime are in Unix format
    struct Stay {
        uint id;
        uint startTime;
        uint endTime;
        address client;
    }

    struct Asset {
        uint id;
        // room, beds...
        string category;
        // needed to ask for a payment
        uint price;
        string currency;
        // needed to retreive metadata from ipfs
        string[] metadataHashes;
        // all stays
        uint[] stayIds;
    }

    function Property(string _name, address _owner) public payable {
        // owner of this Property = the one who owns the company that Property is associated with
        transferOwnership(_owner);
        name = _name;
    }

    // this is metadata for assets, basically an ipfs hash
    function addMetadataHashForAsset(uint _id, string hash) public onlyOwner {
        assets[_id].metadataHashes.push(hash);
    }

    // we keep all history of every metadata files
    function lastMetadataHashForAsset(uint _id) public constant returns (string) {
        require(assets[_id].metadataHashes.length > 0);
        return assets[_id].metadataHashes[assets[_id].metadataHashes.length - 1];
    }

    function addAsset(string _category, uint _price, string _currency) public onlyOwner {
        uint newAssetId = assets.length;
        string[] memory metadataHashes;
        uint[] memory stayIds;
        assets.push(Asset(newAssetId, _category, _price, _currency, metadataHashes, stayIds));
    }

    function getAsset(uint _id) public constant returns (uint, string, uint, string) {
        Asset memory asset = assets[_id];
        return (asset.id, asset.category, asset.price, asset.currency);
    }

    function addStay(uint _assetId, uint _startTime, uint _endTime) public payable{
        // check if the amount of wei(!) sent is sufficient
        require(msg.value >= assets[_assetId].price);
        require(_endTime > _startTime);

        uint stayId = stays[_assetId].stays.length;
        stays[_assetId].stays.push(Stay(stayId, _startTime, _endTime, msg.sender));
        assets[_assetId].stayIds.push(stayId);
    }

    function getStay(uint _assetId, uint _stayId) returns(uint, uint, uint) {
        Stay memory stay = stays[_assetId].stays[_stayId];
        return (stay.id, stay.startTime, stay.endTime);
    }

    function getStays(uint _assetId) public returns(uint[] ) {
        return assets[_assetId].stayIds;
    }

    function numberOfAssets() public returns(uint) {
        return assets.length;
    }

    function getBalance() public constant returns(uint) {
        return this.balance;
    }
}