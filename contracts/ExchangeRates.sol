pragma solidity ^0.4.17;

import "./usingOraclize.sol";

contract ExchangeRates is usingOraclize {
    mapping(bytes32 => uint) rates; 

    function ExchangeRates() public payable {
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        getRates();
    }

    function __callback(bytes32 myid, string price) public {
        rates["CAD"] = parseInt(price, 2);
        getRates();
    }

    function getRates() public payable {
        oraclize_query(60, "URL", "json(https://azolgowbec.localtunnel.me/currency).price");
    }

    function getRate(bytes32 _currency) public view returns(uint) {
        return rates[_currency];
    }
}