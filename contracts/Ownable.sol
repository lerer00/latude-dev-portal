pragma solidity ^0.4.15;

contract Ownable {
  address public owner;

  function Ownable() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function transferOwnership(address newOwner) onlyOwner public {
    require(newOwner != address(0));
    owner = newOwner;
  }

  function terminate() onlyOwner {
    // Transfer Eth to owner and terminate contract
    selfdestruct(owner);
  }
}
