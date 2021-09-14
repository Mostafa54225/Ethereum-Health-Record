// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract Ownable {
  address public owner;
  mapping(address => bool) public isAdmin;
  event TransferOwnerShip(address indexed oldOwner, address indexed newOwner);
  event AdminAdded(address indexed adminAddress);
  event AdminRemoved(address indexed adminAddress);

  constructor () {
    owner = msg.sender;
    isAdmin[msg.sender] = true;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  modifier onlyAdmin() {
    require(isAdmin[msg.sender] == true);
    _;
  }

  function setOwner(address _owner) public onlyOwner {
    require(msg.sender != _owner, "Already you are the owner");
    owner = _owner;
    emit TransferOwnerShip(msg.sender, _owner);
  }

  function addAdmin(address _adminAddress) public onlyOwner {
    require(!isAdmin[_adminAddress], "User is already Admin!");
    isAdmin[_adminAddress] = true;
    emit AdminAdded(_adminAddress);
  }
  function removeAdmin(address _adminAddress) public onlyOwner {
    require(_adminAddress != owner);
    require(isAdmin[_adminAddress]);
    isAdmin[_adminAddress] = false;
    emit AdminRemoved(_adminAddress);
  }
}