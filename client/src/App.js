import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Courses from "./components/Courses.js";
import CourseDetail from "./components/CourseDetail";
import UserSignIn from "./components/UserSignIn";
import UserSignUp from "./components/UserSignUp";
import UserSignOut from "./components/UserSignOut";
import CreateCourse from "./components/CreateCourse";
import UpdateCourse from "./components/UpdateCourse";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";
import Forbidden from "./components/Forbidden";
import UnhandledError from "./components/UnhandledError"
import AuthProvider from "./components/Context.js";

const App = () => {
  return (
    <AuthProvider>
      <Fragment>
        <Switch>
          <Route exact path="/" render={() => <Courses />} />
          <Route component={Courses} exact path="/courses"></Route>
          <PrivateRoute component={CreateCourse} path="/courses/create"></PrivateRoute>
          <PrivateRoute component={UpdateCourse} exact path={"/courses/:id/update"}></PrivateRoute>
          <Route component={CourseDetail} exact path="/courses/:id"></Route>
          <Route exact path="/signin" render={() => <UserSignIn />} />
          <Route exact path="/signup" render={() => <UserSignUp />} />
          <Route exact path="/signout" component={UserSignOut} />
          <Route exact path="/notfound" component={NotFound} />
          <Route exact path="/forbidden" component={Forbidden} />
          <Route exact path="/error" component={UnhandledError} />
          <Route render={() => <NotFound />} />
        </Switch>
      </Fragment>
    </AuthProvider>
  );
};

export default App;