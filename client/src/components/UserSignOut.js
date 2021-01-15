import React, { useContext } from "react";
import "../App.css";
import { AuthContext } from "./Context";
import { Redirect } from 'react-router-dom';

//Signs out the authenticated user and redirects the user to the default route (i.e. the list of courses).
const UserSignOut = () => {
  useContext(AuthContext).signOut();
  return <Redirect to="/" />;
};

export default UserSignOut;