import React from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { FaArrowRight, FaTimes, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import VerificationErrorModal from "./auth/signup/VerificationErrorModal";
import { Redirect } from "react-router-dom";

/**
 * The component that handles verifying a user;
 * Makes use of amazon-cognito-identity-js to confirm the
 * verification code sent to the email of a recently created user
 */
class VerificationCode extends React.Component {
  state = {
    verifying: false,
    code: "",
    modal: false
  };

  // Once the user is verified they are redirected to the login page
  render() {
    if (this.state.verified) {
      return <Redirect to="/login" />;
    }
    let SubmitButton = () => (
      <Button
        type="submit"
        id="signup"
        color="success"
        size="l"
        onClick={this.authenticating}
        className="mt-3 mb-3 ml-2"
      >
        {!this.state.verifying ? (
          <span>
            Submit <FaArrowRight />
          </span>
        ) : (
          <span>
            Verifying... <FaSpinner />{" "}
          </span>
        )}
        {this.state.error && (
          <VerificationErrorModal
            error={this.state.error}
            modal={this.state.modal}
            onError={this.onError}
          />
        )}
      </Button>
    );

    // Cancelling would redirect to the splash page
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
          <Form style={{ width: "100%" }}>
            <FormGroup style={{ width: "30%", margin: "5px auto" }}>
              <Label for="name">
                <b>Verification Code</b>
              </Label>
              <Input
                type="password"
                onChange={this.handleCodeInput}
                value={this.state.code}
                valid={this.validateCode(this.state.code)}
              />
            </FormGroup>
            <br />
            <div>
              <CancelButton />
              <SubmitButton />
            </div>
          </Form>
        </div>
      </div>
    );
  }

  // Basic validation to check if the user has inputted anything
  validateCode = input => {
    return input.length > 0;
  };

  // Update the state on user input
  handleCodeInput = e => {
    this.setState({
      code: e.target.value
    });
  };

  // Toggle an error modal if there is an error
  onError = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  // Authenticate the user
  authenticating = e => {
    this.setState({ verifying: true });
    e.preventDefault();
    const poolData = {
      UserPoolId: "us-east-1_p4KcysLln",
      ClientId: process.env.REACT_APP_CLIENT_ID
    };

    let userPool = new CognitoUserPool(poolData);

    let userData = {
      Username: this.props.username,
      Pool: userPool
    };

    let cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(this.state.code, true, (err, result) => {
      this.setState({ verifying: false });
      if (err) {
        this.setState({ error: err, modal: true });
        return;
      }
      this.setState({ verified: true, modal: false });
    });
  };
}
export default VerificationCode;
