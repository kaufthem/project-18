import React, { useState, useEffect } from "react";
import "../App.css";
import Header from "./Header";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

/* 
  This component provides the "Courses" screen by retrieving the list of courses 
  from the REST API's /api/courses route and rendering a list of courses.

  This component also renders a link to the "Create Course" screen.
*/
function Courses(props) {
  const [courses, setCourses] = useState([]);
  const user = props.user;
  useEffect(() => {
    fetch("http://localhost:5000/api/courses", { method: "GET" })
      .then(res => res.json())
      .then(json => setCourses(json))
  }, []);

  return (
    <React.Fragment>
      <Header />
      <div className="bounds">
        {Object.keys(courses).map((course) => (
          <div className="grid-33" key={courses[course].id}>
            <Link className="course--module course--link"
              to={{pathname: `/courses/${courses[course].id}`, state: { course: courses[course] }}}>
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{courses[course].title}</h3>
            </Link>
          </div>
        ))}
        <div className="grid-33">
          <Link className="course--module course--add--module"
            to={{pathname: "/courses/create", state: {user: user}}}>
            <h3 className="course--add--title">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>
              New Course
            </h3>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Courses);