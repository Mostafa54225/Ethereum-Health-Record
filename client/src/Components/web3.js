import Web3 from 'web3'
import Ownableabi from '../contracts/Ownable.json'
import Hospitalabi from '../contracts/Hospital.json'
import Patientabi from '../contracts/Patient.json'

export default async function InitializeWeb3() {
  await window.ethereum.enable()
  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
  const networkId = await web3.eth.net.getId()
  const accounts = await web3.eth.getAccounts()
  const deployedNetworkOwnable = Ownableabi.networks[networkId]
  const deployedNetworkHospital = Hospitalabi.networks[networkId]
  const deployedNetworkPatient = Patientabi.networks[networkId]

  const instanceOwnable = await new web3.eth.Contract(Ownableabi.abi, deployedNetworkOwnable.address)
  const instanceHospital = await new web3.eth.Contract(Hospitalabi.abi, deployedNetworkHospital.address)
  const instancePatient = await new web3.eth.Contract(Patientabi.abi, deployedNetworkPatient.address)
  
  return [accounts, instanceOwnable, instanceHospital, instancePatient]
}

