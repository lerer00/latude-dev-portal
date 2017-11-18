pragma solidity ^0.4.17;

import "./Ownable.sol";
import "./ExchangeRates.sol";
import "./StayLinkedList.sol";

contract Property is Ownable, StayLinkedList {
    string public name;
    Asset[] assets;
    mapping(uint => mapping(uint => Stay)) stays;

    // We need to query an already deployed exhange.
    ExchangeRates exchangeRates;

    // We are using the unix epoch format.
    struct Stay {
        uint startTime;
        uint endTime;
        address user;
    }

    // Basic information about an asset, more details will be provided by ipfs.
    struct Asset {
        uint id;
        uint price;
        bytes32 currency;
        string[] metadataHashes;
    }

    function Property(string _name, address _owner, address _exchangeContract) public payable {
        // The owner of this Property = the one who owns the company that Property is associated with.
        transferOwnership(_owner);
        name = _name;

        // Make sure this contract is always calling the same exchange to convert user currency into ETH.
        exchangeRates = ExchangeRates(_exchangeContract);
    }

    // Ipfs hashes are used to retreive further information about an asset.
    function addMetadataHashForAsset(uint id, string hash) onlyOwner public {
        assets[id].metadataHashes.push(hash);
    }

    function lastMetadataHashForAsset(uint id) public view returns (string) {
        require(assets[id].metadataHashes.length > 0);
        return assets[id].metadataHashes[assets[id].metadataHashes.length - 1];
    }

    // Asset management ////////////////
    function addAsset(uint price, bytes32 currency) onlyOwner public {
        require(exchangeRates.isCurrencyAllowed(currency));

        uint newAssetId = assets.length;
        StayLinkedList.initializeAssetList(newAssetId);
        string[] memory metadataHashes;
        assets.push(Asset(newAssetId, price, currency, metadataHashes));
    }

    function getAsset(uint id) public view returns (uint, uint, bytes32) {
        Asset memory asset = assets[id];
        return (asset.id, asset.price, asset.currency);
    }

    // Stay management ////////////////
    function addStay(uint assetId, uint startTime, uint endTime) public payable {
        require(endTime > startTime);
        require(now <= startTime);
        
        // Check that duration is legitimate.
        uint stayDurationInDays = (endTime - startTime) / 60 / 60 / 24;

        // Check if the amount of wei sent is sufficient.
        uint weiPriceForTheStay = getStayPriceInWei(assetId, stayDurationInDays);
        require(msg.value >= weiPriceForTheStay);

        // Here we'll need to return all surpluses to the paying user
        // msg.value - weiPriceForTheStay -> return to msg.sender

        // Add the stay within the linked list.
        StayLinkedList.insertNode(assetId, startTime, endTime - startTime);
        
        // Map it within stays.
        stays[assetId][startTime] = Stay(startTime, endTime, msg.sender);
    }

    function getStay(uint assetId, uint stayId) public view returns(uint, uint, address) {
        Stay memory stay = stays[assetId][stayId];
        return (stay.startTime, stay.endTime, stay.user);
    }

    function getStays(uint assetId, uint from, uint to) public view returns(uint[]) {
        return StayLinkedList.getNodesBetween(assetId, from, to);
    }

    function getStayPriceInWei(uint assetId, uint stayDurationInDays) public view returns(uint) {
        require(stayDurationInDays > 0);

        Asset memory asset = assets[assetId];
        uint weiPriceForSingleDay = ((asset.price * 100 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000) / exchangeRates.getCurrencyRate(asset.currency));
        uint weiPriceForTheStay = weiPriceForSingleDay * stayDurationInDays;

        return weiPriceForTheStay;
    }

    // TODO, this is somewhat obscur since we need this because id are created from 0 - inf
    function numberOfAssets() public view returns(uint) {
        return assets.length;
    }
}