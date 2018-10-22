import React, { Component } from "react";
import firebase from "firebase";
import Header from "./Header";

class Login extends Component {
  state = { email: "", password: "", error: "" };
  handleEmailChange = event => {
    this.setState({
      email: event.target.value
    });
  };
  handlePasswordChange = event => {
    this.setState({
      password: event.target.value
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state);
    this.setState({ error: "" });
    if (this.state.email && this.state.password) {
      this.login();
    } else {
      this.setState({ error: "Please fill in both fields" });
    }
  };
  signup = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
        this.setState({
          error: "Error signing up"
        });
      });
  };
  onLogin = () => {
    this.props.history.push("/");
  };
  login = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(res => {
        console.log(res);
        this.onLogin();
      })
      .catch(error => {
        console.log(error);
        if (error.code === "auth/user-not-found") {
          console.log("sign up");
          this.signup();
        } else {
          this.setState({ error: "Error logging in" });
        }
      });
  };
  render() {
    return (
      <div id="LoginContainer" className="inner-container">
        <Header />
        <form onSubmit={this.handleSubmit}>
          <p>Sign in or sign up by entering email and password</p>
          <input type="text" onChange={this.handleEmailChange} value={this.state.email} placeholder="Your email" />
          <input
            type="password"
            onChange={this.handlePasswordChange}
            value={this.state.password}
            placeholder="Your password"
          />
          <p className="error">{this.state.error}</p>
          <button className="red light" type="submit">
            Login
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
