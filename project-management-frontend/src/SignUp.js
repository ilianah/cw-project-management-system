import React from "react";
import { Button, Form } from "reactstrap";
import { FaArrowRight, FaTimes, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";
import SignUpErrorModal from "./auth/signup/SignUpErrorModal";
import SignUpUsernameField from "./auth/signup/SignUpUsernameField";
import SignUpPasswordField from "./auth/signup/SignUpPasswordField";
import SignUpNameField from "./auth/signup/SignUpNameField";
import SignUpEmailField from "./auth/signup/SignUpEmailField";
import SignUpBirthdayField from "./auth/signup/SignUpBirthdayField";
import VerificationCode from "./VerificationCode";

/**
 * Custom signup from making use of amazon-cognito-identity-js library to sign up a new user
 * with specified attributes; The picture attribute is preset to an automatic one that can be later
 * changed via the MyProfile component; This component's state holds the information about all user attributes
 * predefined in the Cognito User Pool
 */
class SignUp extends React.Component {
  state = {
    signingUp: false,
    username: "",
    birthdate: "",
    name: "",
    email: "",
    password: "",
    repeatedPassword: "",
    modal: false
  };

  render() {
    // Buttons
    let SignUpButton = () => (
      <Button
        type="submit"
        id="signup"
        color="success"
        size="l"
        onClick={this.signup}
        className="mt-3 mb-3 ml-2"
        disabled={this.state.signingUp}
      >
        {!this.state.signingUp ? (
          <span>
            Sign Up <FaArrowRight />
          </span>
        ) : (
          <span>
            Signing you up... <FaSpinner />{" "}
          </span>
        )}
        {this.state.error && (
          <SignUpErrorModal modal={this.state.modal} onError={this.onError} />
        )}
      </Button>
    );

    let CancelButton = () => (
      <Link to="/">
        <Button
          type="button"
          color="danger"
          size="l"
          className="mt-3 mb-3 mr-2"
        >
          <FaTimes /> Cancel
        </Button>
      </Link>
    );

    return (
      <div className="background ">
        <div className="header" />
        <div className="form-box">
          {this.state.verificationStep && !this.state.error ? (
            <VerificationCode
              username={this.state.username}
              password={this.state.password}
            />
          ) : (
            <Form style={{ width: "100%" }}>
              <SignUpNameField
                handleNameInput={this.handleNameInput}
                name={this.state.name}
              />
              <SignUpUsernameField
                handleUsernameInput={this.handleUsernameInput}
                username={this.state.username}
              />
              <SignUpEmailField
                handleEmailInput={this.handleEmailInput}
                email={this.state.email}
              />
              <SignUpPasswordField
                handlePasswordInput={this.handlePasswordInput}
                handleRepeatedPasswordInput={this.handleRepeatedPasswordInput}
                password={this.state.password}
                repeatedPassword={this.state.repeatedPassword}
              />
              <SignUpBirthdayField
                handleBirthdateInput={this.handleBirthdateInput}
                birthdate={this.state.birthdate}
              />

              <br />
              <div>
                <CancelButton />
                <SignUpButton />
              </div>
            </Form>
          )}

          {this.state.error && (
            <SignUpErrorModal
              error={this.state.error}
              modal={this.state.modal}
              onError={this.onError}
            />
          )}
        </div>
      </div>
    );
  }

  /**
   * Handlers for attributes input
   */
  handleUsernameInput = e => {
    this.setState({ username: e.target.value });
  };

  handleBirthdateInput = e => {
    this.setState({ birthdate: e.target.value });
  };

  handleNameInput = e => {
    this.setState({ name: e.target.value });
  };

  handleEmailInput = e => {
    this.setState({ email: e.target.value });
  };
  handlePasswordInput = e => {
    this.setState({
      password: e.target.value
    });
  };

  handleRepeatedPasswordInput = e => {
    this.setState({
      repeatedPassword: e.target.value
    });
  };

  onError = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  // Use amazon-cognito-identity-js to sign up a new user
  signup = () => {
    const poolData = {
      UserPoolId: "us-east-1_p4KcysLln",
      ClientId: process.env.REACT_APP_CLIENT_ID
    };

    let userPool = new CognitoUserPool(poolData);

    let attributeList = [];

    // Access the attributes from the state
    let userBirthdate = {
      Name: "birthdate",
      Value: this.state.birthdate
    };

    let userName = {
      Name: "name",
      Value: this.state.name
    };

    let userPicture = {
      Name: "picture",
      Value:
        "https://vignette.wikia.nocookie.net/bungostraydogs/images/1/1e/Profile-icon-9.png/revision/latest?cb=20171030104015"
    };
    let userEmail = {
      Name: "email",
      Value: this.state.email
    };

    // Initiate the Cognito attributes
    let attributeBirthdate = new CognitoUserAttribute(userBirthdate);
    let attributeName = new CognitoUserAttribute(userName);
    let attributePicture = new CognitoUserAttribute(userPicture);
    let attributeEmail = new CognitoUserAttribute(userEmail);

    attributeList.push(attributeBirthdate);
    attributeList.push(attributeName);
    attributeList.push(attributePicture);
    attributeList.push(attributeEmail);

    this.setState({ signingUp: true });

    // Sing up the new user with the information from the state
    userPool.signUp(
      this.state.username,
      this.state.password,
      attributeList,
      null,
      (err, result) => {
        if (err) {
          this.setState({
            signingUp: false,
            modal: true,
            verificationStep: false,
            error: err
          });
        }
        this.setState({ verificationStep: true });
      }
    );
  };
}
export default SignUp;
