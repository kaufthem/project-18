import React from "react";
import { useState } from "react";
export const AuthContext = React.createContext();

//Global state provider of user authentification
const AuthProvider = (props) => {
  const [authUser, setAuthUser] = useState({});
  const [isAuth, setAuth] = useState(false);
  const [courses, setCourses] = useState([]);
  
  const signIn = (email, password, callback = () => {}) => {
    const base64 = require("base-64");
    let headers = new Headers();
    headers.append("Authorization", "Basic " + base64.encode(email + ":" + password));
    
    fetch("http://localhost:5000/api/users", {method: "GET", headers: headers})
      .then(res => res.json())
      .then(user => {
        if (user.id) {
          setAuthUser({
            userId: user.id,
            firstName: user.firstName, lastName: user.lastName,
            email: email, password: password
          });
          setAuth(true);
          callback(true);
        } else {
          callback(false);
        }
      });
  };

  const signOut = () => {
    setAuthUser({userId: 0, firstName: "", lastName: "", email: "", password: ""});
    setAuth(false);
  };
  
  const data = {
    authUser: { get: authUser, set: setAuthUser },
    isAuth: { get: isAuth, set: setAuth },
    courses: { get: courses, set: setCourses },
    signIn: signIn, signOut: signOut
  };

  return (
    <AuthContext.Provider value={data}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;