pragma solidity ^0.4.17;

import "./Ownable.sol";
import "./ExchangeRates.sol";

contract Property is Ownable {
    string public name;
    Asset[] assets;
    mapping(uint => Stays) stays;
    ExchangeRates exchangeRates;
    
    // this is to bypass the problem related to copying memory struct arrays to storage
    struct Stays {
        Stay[] stays;
    }

    // startTime and endTime are in Unix format
    struct Stay {
        uint id;
        uint startTime;
        uint endTime;
        address user;
    }

    // basic information about an asset, futher will come from ipfs
    struct Asset {
        uint id;
        uint price;
        bytes32 currency;
        string[] metadataHashes;
        uint[] stayIds;
    }

    function Property(string _name, address _owner, address _exchangeContract) public payable {
        // owner of this Property = the one who owns the company that Property is associated with
        transferOwnership(_owner);
        name = _name;

        // make sure this contract is always calling the same exchange to convert user currency into ETH
        exchangeRates = ExchangeRates(_exchangeContract);
    }

    // ipfs hashes are used to retreive further information about an asset
    function addMetadataHashForAsset(uint _id, string hash) onlyOwner public {
        assets[_id].metadataHashes.push(hash);
    }
    function lastMetadataHashForAsset(uint _id) public view returns (string) {
        require(assets[_id].metadataHashes.length > 0);
        return assets[_id].metadataHashes[assets[_id].metadataHashes.length - 1];
    }

    // asset management ////////////////
    function addAsset(uint _price, bytes32 _currency) onlyOwner public {
        uint newAssetId = assets.length;
        string[] memory metadataHashes;
        uint[] memory stayIds;
        assets.push(Asset(newAssetId, _price, _currency, metadataHashes, stayIds));
    }

    function getAsset(uint _id) public view returns (uint, uint, bytes32) {
        Asset memory asset = assets[_id];
        return (asset.id, asset.price, asset.currency);
    }

    // stay management ////////////////
    function addStay(uint _assetId, uint _startTime, uint _endTime) public payable {
        require(_endTime > _startTime);
        require(now <= _startTime);
        
        // check that duration is legitimate
        uint stayDurationInDays = (_endTime - _startTime) / minutes / hours / days ;

        // check if the amount of wei sent is sufficient
        uint weiPriceForTheStay = getStayPriceInWei(_assetId, stayDurationInDays);
        require(msg.value >= weiPriceForTheStay);

        // Here we'll need to return all surpluses to the paying user
        // msg.value - weiPriceForTheStay -> return to msg.sender

        uint stayId = stays[_assetId].stays.length;
        stays[_assetId].stays.push(Stay(stayId, _startTime, _endTime, msg.sender));
        assets[_assetId].stayIds.push(stayId);
    }

    function getStay(uint _assetId, uint _stayId) public view returns(uint, uint, uint, address) {
        Stay memory stay = stays[_assetId].stays[_stayId];
        return (stay.id, stay.startTime, stay.endTime, address stay.user);
    }

    function getStayPriceInWei(uint _assetId, uint _stayDurationInDays) public view returns(uint) {
        require(_stayDurationInDays > 0);

        Asset memory asset = assets[_assetId];
        uint weiPriceForSingleDay = ((asset.price * 100 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000) / exchangeRates.getRate(asset.currency));
        uint weiPriceForTheStay = weiPriceForSingleDay * _stayDurationInDays;

        return weiPriceForTheStay;
    }

    function getStays(uint _assetId) public view returns(uint[] ) {
        return assets[_assetId].stayIds;
    }

    // TODO, this is somewhat obscur since we need this because id are created from 0 - inf
    function numberOfAssets() public view returns(uint) {
        return assets.length;
    }
}