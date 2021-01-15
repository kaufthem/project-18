import React, { useContext } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { AuthContext } from "./Context";

function Header() {
  const context = useContext(AuthContext);
  const currentUser = context.authUser.get;
  const isAuth = context.isAuth.get;
  return (
    <>
      <div className="header">
        <div className="bounds">
          <h1 className="header--logo">Courses</h1>
          <nav>
            {isAuth && (<span>{" "}Welcome {currentUser.firstName} {currentUser.lastName}!{" "}</span>)}
            {isAuth && (<Link className="signup" to="/signout">Sign Out</Link>)}
            {!isAuth && (<Link className="signup" to="/signup">Sign Up</Link>)}
            {!isAuth && (<Link className="signin" to="/signin">Sign In</Link>)}
          </nav>
        </div>
      </div>
      <hr />
    </>
  );
}

export default Header;