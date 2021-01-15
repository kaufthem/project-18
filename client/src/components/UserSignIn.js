import React, { useState, useContext } from "react";
import "../App.css";
import Header from "./Header";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { AuthContext } from "./Context";

/*
  This component provides the "Sign In" screen by rendering a form that allows a user to sign using their existing account information. 
  
  The component also renders a "Sign In" button that when clicked signs in the user and a "Cancel" button that returns the user 
  to the default route (i.e. the list of courses).
*/
const UserSignIn = (props) => {
  const context = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const callback = (flag) => {
    if (!flag) setErrorMsg("Enter a valid email address or password.");
    else props.history.push("/courses");
  };
  const auth = (email, password, callback) => {
    context.signIn(email, password, callback);
  };

  return (
    <AuthContext.Consumer>
      {() => (
        <React.Fragment>
          <div id="root">
            <Header />
            <div className="bounds">
              <div className="grid-33 centered signin">
                <h1>User Sign In</h1>
                <div>
                  <form>
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
                    <div className="grid-100 pad-bottom">
                      <button className="button" type="button"
                        onClick={() => auth(email, password, callback)}
                      >Sign In</button>
                      <button className="button button-secondary"
                        onClick={() => props.history.push("/courses")}
                      >Cancel</button>
                    </div>
                    {errorMsg && <p style={{ color: "purple" }}>{errorMsg}</p>}
                  </form>
                </div>
                <p>&nbsp;</p>
                <p>Don't have a user account?{" "}<Link to="/signup">Click here</Link> to sign up!</p>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </AuthContext.Consumer>
  );
};

export default withRouter(UserSignIn);