// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import './Ownable.sol';

contract Hospital is Ownable {
  uint256 private hospitalCount;
  mapping(address => bool) isHospital;

  struct HospitalDetails {
    uint256 id;
    string hospitalName;
    string hospitalLocation;
    address hospitalAddress;
    bool isApproved;
  }

  mapping(address => HospitalDetails) hospitals;
  address[] public hospitalList;


  modifier onlyHospital() {
    require(isHospital[msg.sender]);
    _;
  }

  function addHospital(string memory _hospitalName, string memory _hospitalLocation, address _hospitalAddress) public onlyAdmin {
    require(!isHospital[_hospitalAddress], "Already Added");
    hospitalList.push(_hospitalAddress);
    hospitalCount++;
    isHospital[_hospitalAddress] = true;
    hospitals[_hospitalAddress] = HospitalDetails(hospitalCount, _hospitalName, _hospitalLocation, _hospitalAddress, true);
  }

  function getHospital(address _address) 
    public view returns(
      uint256 id,
      string memory hospitalName,
      string memory hospitalLocation,
      address hospitalAddress,
      bool isApproved
    )
  {
    require(hospitals[_address].isApproved);
    HospitalDetails memory hospital = hospitals[_address];
    return (hospital.id, hospital.hospitalName, hospital.hospitalLocation, hospital.hospitalAddress, hospital.isApproved);
  }

  function getHospitalCount() public view returns(uint256) {
    return hospitalCount;
  }
}