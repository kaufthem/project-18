import React, { useContext } from "react";
import { Route } from "react-router-dom";
import Forbidden from "./Forbidden";
import { AuthContext } from "./Context";

const PrivateRoute = ({ component, ...options }) => {
  const context = useContext(AuthContext);
  const isAuth = context.isAuth.get;
  const LastComponent = isAuth === true ? component : Forbidden;
  return <Route {...options} component={LastComponent} />;
};

export default PrivateRoute;