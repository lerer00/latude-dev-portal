pragma solidity ^0.4.13;

contract Owned {
  address owner;

  function Owned() {
    owner = msg.sender;
  }

  modifier owner_only() {
    if (msg.sender == owner) {
      _;
    }
  }

  function terminate() owner_only {
    // Transfer Eth to owner and terminate contract
    selfdestruct(owner);
  }
}