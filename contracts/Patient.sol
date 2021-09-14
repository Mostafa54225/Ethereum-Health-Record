// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

pragma experimental ABIEncoderV2;

import './Hospital.sol';

contract Patient is Hospital {
  uint256 private patientCount;


  struct Records {
    string hospitalName;
    string reason;
    string admittedOn;
    string dischargedOn;
    string ipfs;
  }

  struct patientDetails {
    uint256 id;
    string name;
    string phone;
    string gender;
    string dob;
    string bloodGroup;
    string allergies;
    Records[] records;
    address patientAddress;
  }

  address[] public patientList;
  mapping(address => mapping(address => bool)) isAuth;
  mapping(address => patientDetails) patients;
  mapping(address => bool) isPatient;


  function addRecord(
    address _patientAddress,
    string memory _hospitalName, 
    string memory _reason, 
    string memory _admittedOn, 
    string memory _dischargedOn,
    string memory _ipfs) public {
      require(isPatient[_patientAddress], "User Not Registered");
      require(isAuth[_patientAddress][msg.sender], "No Permission to add records");

      patients[_patientAddress].records.push(Records(_hospitalName, _reason, _admittedOn, _dischargedOn, _ipfs));
    }

  function addPatient(
    string memory _name,
    string memory _phone,
    string memory _gender,
    string memory _dob,
    string memory _bloodGroup,
    string memory _allergies
    ) public {
      require(!isPatient[msg.sender], "Already Patient Account Exist!");
      patientList.push(msg.sender);
      patientCount++;
      isPatient[msg.sender] = true;
      isAuth[msg.sender][msg.sender] = true;
      patients[msg.sender].id = patientCount;
      patients[msg.sender].name = _name;
      patients[msg.sender].phone = _phone;
      patients[msg.sender].gender = _gender;
      patients[msg.sender].dob = _dob;
      patients[msg.sender].bloodGroup = _bloodGroup;
      patients[msg.sender].allergies = _allergies;
      patients[msg.sender].patientAddress = msg.sender;
    }

  function getPatientDetails(address _patientAddress) public view returns(
    string memory _name,
    string memory _phone,
    string memory _gender,
    string memory _dob,
    string memory _bloodGroup,
    string memory _allergies
  ) {
    require(isAuth[_patientAddress][msg.sender], "You have no permission to access the patient details");
    require(isPatient[_patientAddress], "Patient doesn't exist on the network");
    patientDetails memory patient = patients[_patientAddress];
    return (patient.name, patient.phone, patient.gender, patient.dob, patient.bloodGroup, patient.allergies);
  }

  function getPatientRecords(address _patientAddress) public view returns(
    string[] memory _hospitalName,
    string[] memory _reason,
    string[] memory _admittedOn,
    string[] memory _dischargedOn,
    string[] memory _ipfs
  ) {
    require(isAuth[_patientAddress][msg.sender], "No Permission to get Records");
    require(isPatient[_patientAddress]);
    require(patients[_patientAddress].records.length > 0, "This Patient has no records");

    string[] memory HospitalName = new string[](patients[_patientAddress].records.length);
    string[] memory Reason = new string[](patients[_patientAddress].records.length);
    string[] memory AdmOn = new string[](patients[_patientAddress].records.length);
    string[] memory DisOn = new string[](patients[_patientAddress].records.length);
    string[] memory IPFS = new string[](patients[_patientAddress].records.length);

    for(uint256 i = 0; i < patients[_patientAddress].records.length; i++) {
      HospitalName[i] = patients[_patientAddress].records[i].hospitalName;
      Reason[i] = patients[_patientAddress].records[i].reason;
      AdmOn[i] = patients[_patientAddress].records[i].admittedOn;
      DisOn[i] = patients[_patientAddress].records[i].dischargedOn;
      IPFS[i] = patients[_patientAddress].records[i].ipfs;
    }

    return (HospitalName, Reason, AdmOn, DisOn, IPFS);
  }


  function addAuth(address _addr) public {
    require(!isAuth[msg.sender][_addr], "Already Authorized");
    require(msg.sender != _addr);
    isAuth[msg.sender][_addr] = true;
  }

  function revokeAuth(address _addr) public {
    require(isAuth[msg.sender][_addr], "Already Not Authorized");
    require(msg.sender != _addr);
    isAuth[msg.sender][_addr] = false;
  }

  function addAuthFromTo(address _from, address _to) public {
    require(!isAuth[_from][_to], "Already Authorized");
    require(_from != _to, "Can't Autorize yourself");
    require(isAuth[_from][msg.sender], "You don't have a permission to access");
    require(isPatient[_from], "Patient Not Registered");
    isAuth[_from][_to] = true;
  }

  function removeAuthFromTo(address _from, address _to) public {
    require(!isAuth[_from][_to], "already Not Authorized");
    require(_from != _to, "Can't Remove Same Address");
    require(isAuth[_from][msg.sender], "You Don't have a permission to do this action");
    require(isPatient[_from]);
    isAuth[_from][_to] = true; 
  }

  function getPatientCount() public view returns(uint256) {
    return patientCount;
  }
}