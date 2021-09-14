import React, { Component } from 'react'
import Header from '../Components/Header'
import InitializeWeb3 from '../Components/web3'
import {Table,TableHead,TableContainer,TableBody,TableCell,TableRow,Chip,Card,Grid,Box,Paper, Typography,TextField, Button,CircularProgress} from '@material-ui/core';
import ipfs from '../Components/ipfs'

var CryptoJS = require("crypto-js");
function encode(myString){
    const encodedWord = CryptoJS.enc.Utf8.parse(myString); // encodedWord Array object
    const encoded = CryptoJS.enc.Base64.stringify(encodedWord); // string: 'NzUzMjI1NDE='
    return encoded;
}
  function decode(encoded){
    const encodedWord = CryptoJS.enc.Base64.parse(encoded); // encodedWord via Base64.parse()
    const decoded = CryptoJS.enc.Utf8.stringify(encodedWord); // decode encodedWord via Utf8.stringify() '75322541'
    return decoded;
}

class Patient extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      phone: '',
      gender: '',
      dob: '',
      bloodGroup: '',
      allergy: '',
      account: '',
      patientView: false,
      recordView: '',
      addRecordView: false,
      load: false,
      buffer: null,
      recordLength: 0,
      records: [],
      hospitalName: '',
      reason: '',
      admittedOn: '',
      dischargedOn: '',
      ipfs: '',
      PatientInstance: null,
      patientCount: 0,
      isPatient: false,
      addressPermission: '',
      giveGrantView: false,
      revokeGrantView: false
    }
  }
  async componentDidMount() {
    let [accounts, , , instancePatient] = await InitializeWeb3()
    this.setState({PatientInstance: instancePatient, account: accounts[0]})
    const pCount = await this.state.PatientInstance.methods.getPatientCount().call()
    this.setState({patientCount: pCount})
    for(let i = 0; i < this.state.patientCount; i++) {
      const pAddress = await this.state.PatientInstance.methods.patientList(i).call()
      if(this.state.account === pAddress) {
        this.setState({isPatient: true})
      }
    }
  }

  onHospitalNameChange = (e) => this.setState({hospitalName: e.target.value})
  onReasonChange = (e) => this.setState({reason: e.target.value})
  onAdmittedOnChange = (e) => this.setState({admittedOn: e.target.value})
  onDischargedOnChange = (e) => this.setState({dischargedOn: e.target.value})
  onAddressPermissionChange = (e) => this.setState({addressPermission: e.target.value})
  
  isLoading = () => {
    if(this.state.load) {
      return (
        <Box m={2}>
          <Grid container justifyContent="center">
            <Grid item><CircularProgress /></Grid>
          </Grid>
        </Box>
      )
    }
  }
  
  onGrantSubmit = async () => {
    this.setState({load: true, giveGrantView: false})
    await this.state.PatientInstance.methods.addAuth(this.state.addressPermission).send({from: this.state.account})
    this.setState({load: false, giveGrantView: true})
  }
  onRevokeSubmit = async () => {
    this.setState({load: true, revokeGrantView: false})
    await this.state.PatientInstance.methods.revokeAuth(this.state.addressPermission).send({from: this.state.account})
    this.setState({load: false, revokeGrantView: true})
  }

  giveGrant = () => {
    if(this.state.giveGrantView) {
      return (
        <Grid container justifyContent="center">
          <Grid item>
            <Paper>
              <Box m={2} p={5} alignItems="center">
                <Box display="flex" alignItems="center" justifyContent="cetner">
                  <Typography>Grant Access Permission</Typography>
                </Box> 
                <Box><TextField label="Address" onChange={this.onAddressPermissionChange}></TextField></Box>
                <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                  <Button onClick={this.onGrantSubmit} variant="contained" style={{backgroundColor:"green",color:"floralwhite"}}>Submit</Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )
    }
  }

  revokeGrant = () => {
    if(this.state.revokeGrantView) {
      return (
        <Grid container justifyContent="center">
          <Grid item>
            <Paper>
              <Box m={2} p={5} alignItems="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Typography>Revoke Access Permission</Typography>
                </Box>
                <Box>
                  <TextField label="Address" onChange={this.onAddressPermissionChange}></TextField>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                  <Button onClick={this.onRevokeSubmit} variant="contained" style={{backgroundColor:"green",color:"floralwhite"}}>Submit</Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )
    }
  }

  getPatientDetails = async () => {
    this.setState({load: true})
    await this.state.PatientInstance.methods.getPatientDetails(this.state.account).call({from: this.state.account}).then(result => {
      this.setState({name: result._name, phone: result._phone, gender: result._gender, dob: result._dob, bloodGroup: result._bloodGroup, allergy: result._allergies, patientView: true, load: false})
    })
  }

  getPatientRecords = async () => {
    this.setState({load: true, addRecordView: false,})
    const result = await this.state.PatientInstance.methods.getPatientRecords(this.state.account).call({from: this.state.account})
    this.setState({recordLength: result["_hospitalName"].length})
    let recs = []
    for(let i = 0; i < this.state.recordLength; i++) {
      recs.push({
        hospitalName: result["_hospitalName"][i],
        reason: result["_reason"][i],
        admittedOn: result["_admittedOn"][i],
        dischargedOn: result["_dischargedOn"][i],
        ipfs: result["_ipfs"][i]
      })
    }
    this.setState({records: recs, load: false, recordView: true})
  }

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convetToBuffer(reader)
  }
  convetToBuffer = async (reader) => {
    const buffer = Buffer.from(reader.result)
    this.setState({buffer})
  }

  onRecordSubmit = async () => {
    this.setState({load: true, addRecordView: false})
    let res = await ipfs.add(this.state.buffer)
    console.log(res)
    let url = "https://ipfs.io/ipfs/"+res[0].hash
    var cypherText = encode(CryptoJS.AES.encrypt(JSON.stringify(url), 'dmr').toString())
    var decryptedText = CryptoJS.AES.decrypt(decode(cypherText).toString(), 'dmr').toString(CryptoJS.enc.Utf8)
    console.log("Encrypted: " + cypherText)
    console.log("Decrypted: " + decryptedText)
    this.setState({ipfs: url.toString()})
    await this.state.PatientInstance.methods
    .addRecord(this.state.account, this.state.hospitalName, this.state.reason, this.state.admittedOn, this.state.dischargedOn, cypherText)
    .send({from: this.state.account})

    this.setState({load: false, addRecordView: false})
  }

  addRecordView = () => {
    if(this.state.addRecordView) {
      return (
        <Grid container justifyContent="center">
          <Grid item>
            <Paper>
              <Box m={2} p={5} alignItems="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Typography>Add Records</Typography>
                </Box>
                <Box>
                  <TextField label="Hospital Name" onChange={this.onHospitalNameChange}></TextField>
                </Box>
                <Box>
                  <TextField label="Visit Reason" onChange={this.onReasonChange}></TextField>
                </Box>
                <Box>
                  <TextField type="date" label="Admitted On" onChange={this.onAdmittedOnChange} InputLabelProps={{shrink: true}}></TextField>
                </Box>
                <Box>
                  <TextField type="date" label="Discharged On" onChange={this.onDischargedOnChange} InputLabelProps={{shrink: true}}></TextField>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" mt={2} mb={2}>
                  <TextField type="file" inputProps={{accept:"application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"}} label="Report" InputLabelProps={{ shrink: true }} onChange={this.captureFile}></TextField>
                </Box>
                <Box dsiplay="flex" alignItems="center" justifyContent="center" mb={1}>
                  <Button onClick={this.onRecordSubmit} variant="contained" style={{backgroundColor:"green",color:"floralwhite"}}>Submit</Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )
    }
  }


  viewPatientDetails = () => {
    if(this.state.patientView) {
      return (
        <Box flex="display" alignContent="center" justifyItems="center" m={3}>
          <Grid container justifyContent="center">
            <Grid item>
              <Paper>
                <Box p={7}>
                  <Box mt={-3} mb={3}>
                    <Typography variant={"h5"} align="center">Patient Info</Typography>
                  </Box>
                  <Box m={1}>
                    Name: {"\t"+this.state.name}
                  </Box>
                  <Box m={1}>
                    phone: {"\t"+this.state.phone}
                  </Box>
                  <Box m={1}>
                    gender: {"\t"+this.state.gender}
                  </Box>
                  <Box m={1}>
                    Dob: {"\t"+this.state.dob}
                  </Box>
                  <Box m={1}>
                    Blood Group: {"\t"+this.state.bloodGroup}
                  </Box>
                  <Box m={1}>
                    Allergies: {"\t"+this.state.allergy}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )
    }
    return null
  }


  viewPatientRecords = () => {
    var rows = this.state.records
    if(this.state.recordView) {
      return (
        <Box mt={3} mb={3}>
          <TableContainer component={Paper}>   
          <Table size={"small"}>
            <TableHead>
              <TableRow>
                  <TableCell>
                    Hospital Name
                  </TableCell>
                  <TableCell>
                    Reason
                  </TableCell>
                  <TableCell>
                    Admitted On
                  </TableCell>
                  <TableCell>
                    Discharged On
                  </TableCell>
                  <TableCell>
                    Report
                  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(
                (row,index)=>(
                  <TableRow key={index}>
                    <TableCell>{row["hospitalName"]}</TableCell>
                    <TableCell>{row["reason"]}</TableCell>
                    <TableCell>{row["admittedOn"]}</TableCell>
                    <TableCell>{row["dischargedOn"]}</TableCell>
                    <TableCell><a href={"/#/embed/"+row["ipfs"]} target="_blank">View/Download Record</a></TableCell>
                  </TableRow>
                )
              )} 
            </TableBody>
          </Table>
          </TableContainer> 
        </Box>
      )
    }
  }

  render() {
    if(!this.state.isPatient) {
      return (
        <>
          <h1>Invalid Address</h1>
        </>
      )
    }
    return (
      <>
        <Header />
        <Box m={1}>
          <Box m ={1}><Card>Current Account: {"\t"+this.state.account}</Card></Box>
          <Box m={3}>
            <Grid container justifyContent="center" spacing={3}>
              <Grid item>
                <Chip style={{backgroundColor: "fuchsia"}} label="My Account" onClick={async () => {
                  await this.getPatientDetails()
                  await this.setState({load: false, patientView: true, addRecordView: false, recordView: false, giveGrantView: false, revokeGrantView: false})
                }}></Chip>
              </Grid>
              <Grid item>
                <Chip style={{backgroundColor: "dodgerblue"}} label="My Records" onClick={async () => {
                  await this.getPatientRecords()
                  this.setState({load: false, patientView: false, recordView: true, giveGrantView: false, revokeGrantView: false})
                }}></Chip>
              </Grid>
              <Grid item>
                <Chip style={{backgroundColor: "indianred"}} label="Add Record" onClick={() => {
                  this.setState({load: false, patientView: false, addRecordView: true, recordView: false, giveGrantView: false, revokeGrantView: false})
                }}></Chip>
              </Grid>
              <Grid item>
                <Chip style={{backgroundColor: "indianred"}} label="Grant Permission" onClick={() => {
                  this.setState({load: false, patientView: false, addRecordView: false, recordView: false, giveGrantView: true, revokeGrantView: false})
                }}></Chip>
              </Grid>
              <Grid item>
                <Chip style={{backgroundColor: "indianred"}} label="Revoke Permission" onClick={() => {
                  this.setState({load: false, patientView: false, addRecordView: false, recordView: false, giveGrantView: false, revokeGrantView: true})
                }}></Chip>
              </Grid>
            </Grid>

            {this.isLoading()}
            {this.viewPatientDetails()}
            {this.viewPatientRecords()}
            {this.addRecordView()}
            {this.giveGrant()}
            {this.revokeGrant()}
          </Box>
        </Box>
      </>
    )
  }
}

export default Patient