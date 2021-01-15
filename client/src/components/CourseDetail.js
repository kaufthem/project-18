import React, { useState, useContext } from "react";
import "../App.css";
import Header from "./Header";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "./Context";

/*
  This component provides the "Course Detail" screen by retrieving the detail for 
  a course from the REST API's /api/courses/:id route and rendering the course. 
  
  The component also renders a "Delete Course" button that when clicked will send 
  a DELETE request to the REST API's /api/courses/:id route in order to delete a course. 
  
  This component also renders an "Update Course" button for navigating to the "Update Course" screen.
*/
function CourseDetail(props) {
  const context = useContext(AuthContext);
  const currentUser = context.authUser.get;
  const { state={} } = props.location;
  const { course={} } = state;
  const { User: user={} } = course;
  const [errorMsg, setErrorMsg] = useState("");

  const deleteCourse = () => {
    if (Object.keys(course).length === 0) {
      setErrorMsg("Course not found"); return;
    }

    const base64 = require("base-64");
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Basic " + base64.encode(`${currentUser.email}:${currentUser.password}`));
    
    fetch(`http://localhost:5000/api/courses/${course.id}`, {method: "DELETE", headers: headers})
      .then(res => res.json())
      .then(() => props.history.push("/courses"))
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
    <>
      <Header />
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              {" "}
              {currentUser.userId === course.userId && (
                <span>
                  <Link className="button"
                    to={{pathname: `/courses/${course.id}/update`, state: { course: course }}}
                  >Update Course</Link>
                  <button className="button" type="button" onClick={deleteCourse}>Delete Course</button>
                </span>
              )}
              <Link className="button button-secondary" to="/courses">Return to List</Link>
            </div>
          </div>
        </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            {errorMsg && <p style={{ color: "purple" }}>{errorMsg}</p>}
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{course.title}</h3>
              <p>By {user.firstName} {user.lastName}</p>
            </div>
            <div className="course--description">
              <ReactMarkdown source={course.description} />
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <h3>{course.estimatedTime}</h3>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withRouter(CourseDetail);