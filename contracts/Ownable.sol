pragma solidity ^0.4.17;

contract Ownable {
  address public owner;

  function Ownable() public {
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

  function terminate() onlyOwner public {
    // Transfer Eth to owner and terminate contract
    selfdestruct(owner);
  }
}
