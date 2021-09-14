import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {Card,Grid,Box,Paper, Typography,TextField, Button,CircularProgress,MenuItem} from '@material-ui/core';
import Header from '../Components/Header';
import InitializeWeb3 from '../Components/web3';

class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      load: false,
      signupView: true,
      owner: '',
      account: '',
      PatientInstance: null,
      patientName: '',
      patientPhone: '',
      patientGender: '',
      patientDob: '',
      patientBloodGroup: '',
      patientAllergies: '',
      patientAddress: ''
    }
  }

  async componentDidMount() {
    let [accounts, , , instancePatient] = await InitializeWeb3()
    this.setState({account: accounts[0], PatientInstance: instancePatient})
    
  }
  onPatientNameChange = (e) => this.setState({patientName: e.target.value})
  onPatientPhoneChange = (e) => this.setState({patientPhone: e.target.value})
  onPatientGenderChange = (e) => this.setState({patientGender: e.target.value})
  onPatientDobChange = (e) => this.setState({patientDob: e.target.value})
  onPatientBloodGroupChange = (e) => this.setState({patientBloodGroup: e.target.value})
  onPatientAllergiesChange = (e) => this.setState({patientAllergies: e.target.value})


  isLoading = () => {
    if(this.state.load) {
      return (
        <Box m={5}>
          <Grid container justifyContent="center">
            <Grid item>
              <Box p={5} m={10}><CircularProgress /></Box>
            </Grid>
          </Grid>
        </Box>
      )
    }
    return null
  }

  signUpView = () => {
    if(this.state.signupView) {
      return (
        <Grid container justifyContent="center">
          <Grid item>
            <Paper>
              <Box p={2} m={5}>
                <Box m={1} display="flex" justifyContent="center" alignItems="center">
                  <Typography>Register as Patient</Typography>
                </Box>
                <Box>
                  <TextField label="name" onChange={this.onPatientNameChange}></TextField>
                </Box>
                <Box>
                  <TextField label="phone" onChange={this.onPatientPhoneChange}></TextField>
                </Box>
                <Box>
                  <TextField label="Gender" select size="small" InputLabelProps={{shrink: true}} onChange={this.onPatientGenderChange}>
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                  </TextField>
                </Box>
                <Box>
                  <TextField label="Date of birth" type="date" format={'DD/MM/YYYY'} InputLabelProps={{shrink: true}} onChange={this.onPatientDobChange}></TextField>
                </Box>
                <Box>
                  <TextField label="Blood Group" onChange={this.onPatientBloodGroupChange}></TextField>
                </Box>
                <Box>
                  <TextField label="Allergies" onChange={this.onPatientAllergiesChange}></TextField>
                </Box>
                
                <Box mt={3} display="flex" justifyContent="center" alignItems="center">
                  <Button onClick={this.onSignup} style={{backgroundColor: "purple", color: "white"}}>Sign Up</Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )
    }
  }

  onSignup = async () => {
    this.setState({load: true, signupView: false})
    await this.state.PatientInstance
    .methods
    .addPatient(this.state.patientName, this.state.patientPhone, this.state.patientGender, this.state.patientDob, this.state.patientBloodGroup, this.state.patientAllergies)
    .send({from: this.state.account})

    this.setState({load: false, signupView: true})
    window.location.reload()
  }

  render() {
    return (
      <>
        <Header />
        <Box m={1}>
          {/* <Box m={1}><Card>Contract Owner:{"\t"+this.state.owner}</Card></Box> */}
          <Box m={1}><Card>Current Account:{"\t"+this.state.account}</Card></Box>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography>{"Already Registered User?"}</Typography>
          <Box ml={2} mr={2}>
            <Button variant="outlined" component={Link} to="/patient">Login Here</Button>
          </Box>
        </Box>
        {this.isLoading()}
        {this.signUpView()}
      </>
    )
  }
}

export default Signup