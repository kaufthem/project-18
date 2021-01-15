import React, { useState, useContext } from "react";
import "../App.css";
import Header from "./Header";
import { withRouter } from "react-router";
import { AuthContext } from "./Context";

/*
  This component provides the "Sign Up" screen by rendering a form that allows a user to sign up by creating a new account. 
  The component also renders a "Sign Up" button that when clicked sends a POST request to the REST API's /api/users route and signs in the user. 
  This component also renders a "Cancel" button that returns the user to the default route (i.e. the list of courses).
*/
function UserSignUp(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmedpassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const context = useContext(AuthContext);

  const createUser = () => {
    if (confirmPassword !== password) {
      setErrorMsg("The passwords do not match. Please try again."); return;
    } else {
      setErrorMsg("");
    }

    const user = {firstName: firstName, lastName: lastName, emailAddress: email, password: password};
    fetch("http://localhost:5000/api/users", {method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(user)})
      .then(res => res.json())
      .then(json => {
        if (json.errors) {
          setErrorMsg(json.errors);
        } else if (json.error) {
          setErrorMsg(json.message);
        } else {
          setErrorMsg("");
          context.authUser.set({
            userId: json.newUser.id,
            firstName: json.newUser.firstName,
            lastName: json.newUser.lastName,
            email: json.newUser.emailAddress,
            password: password
          });
          context.isAuth.set(true);
          props.history.push("/courses");
        }
      })
      .catch(err => {
        if (err.message === "Unexpected end of JSON input") {
          props.history.push("/courses");
        } else if (err.response.status === 500) {
          props.history.push("/error");
        } else {
          props.history.push("/notfound");
          console.log(err);
        }
      });
  };

  return (
    <AuthContext.Consumer>
      {() => (
        <>
          <Header />
          <div className="bounds">
            <div className="grid-33 centered UserSignUp">
              <h1>User Sign Up</h1>
              <div>
                <form>
                  <div>
                    <input id="firstName" name="firstName" type="text"
                      className="" placeholder="First Name" value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <input id="lastName" name="lastName" type="text"
                      className="" placeholder="Last Name" value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div>
                    <input id="emailAddress" name="emailAddress" type="text"
                      className="" placeholder="Email Address" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <input id="password" name="password" type="password"
                      className="" placeholder="Password" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <input id="confirmPassword" name="confirmPassword" type="password"
                      className="" placeholder="Confirm Password" value={confirmPassword}
                      onChange={(e) => setConfirmedpassword(e.target.value)}
                    />
                  </div>
                  <div className="grid-100 pad-bottom">
                    <button className="button" type="button"onClick={() => createUser()}>User Sign Up</button>
                    <button className="button button-secondary"onClick={() => props.history.push("/courses")}>Cancel</button>
                  </div>
                </form>
                {errorMsg && !(Array.isArray(errorMsg)) && <p style={{ color: "purple" }}>{errorMsg}</p>}
                {errorMsg && Array.isArray(errorMsg) && errorMsg.length > 0 &&
                  <div className="validation-errors">
                    <ul>{errorMsg.map((error, index) => (<li key={index}>{error}</li>))}</ul>
                  </div>
                }
              </div>
              <p>&nbsp;</p>
              <p>Already have a user account?{" "}<a href="user-sign-in.html">Click here</a> to sign in!</p>
            </div>
          </div>
        </>
      )}
    </AuthContext.Consumer>
  );
}

export default withRouter(UserSignUp);