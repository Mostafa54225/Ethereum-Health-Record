const Ownable = artifacts.require("Ownable");
const Hospital = artifacts.require("Hospital");
const Patient = artifacts.require("Patient");

module.exports = function (deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Hospital);
  deployer.deploy(Patient);
};
