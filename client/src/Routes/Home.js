import React, { Component } from "react";
import {Box} from "@material-ui/core/";
import Header from '../Components/Header'
import LoginCards from '../Components/LoginCards'

export default class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <Box p={-10}>
          <LoginCards />
        </Box>
      </>
    )
  }
}