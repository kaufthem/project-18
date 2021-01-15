import React, { useState, useContext } from "react";
import "../App.css";
import Header from "./Header";
import { withRouter } from "react-router";
import { AuthContext } from "./Context";

/*
  This component provides the "Update Course" screen by rendering a form that allows a user to update one of their existing courses. 
  The component also renders an "Update Course" button that when clicked sends a PUT request to the REST API's /api/courses/:id route. 
  This component also renders a "Cancel" button that returns the user to the "Course Detail" screen.
*/
function UpdateCourse(props) {
  const context = useContext(AuthContext);
  const currentUser = context.authUser.get;
  const { state = {} } = props.location;
  const { course = {} } = state;
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [estimatedTime, setEstimatedTime] = useState(course.estimatedTime);
  const [materialsNeeded, setMaterialsNeeded] = useState(course.materialsNeeded);
  const [errorMsg, setErrorMsg] = useState([]);

  const updateCourse = () => {
    if (Object.keys(course).length === 0) {
      setErrorMsg(["Course not found"]); return;
    }
    const updateData = JSON.stringify({
      userId: course.User.id,
      title: title,
      description: description,
      estimatedTime: estimatedTime,
      materialsNeeded: materialsNeeded
    });

    const base64 = require("base-64");
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Basic " + base64.encode(`${currentUser.email}:${currentUser.password}`));

    fetch(`http://localhost:5000/api/courses/${course.id}`, {method: "PUT", headers: headers, body: updateData})
      .then(res => res.json())
      .then(json => {
        if (json.id) {
          props.history.push("/courses");
        } else {
          setErrorMsg(json.errors);
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
    <>
      <Header />
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        {errorMsg && errorMsg.length > 0 &&
          <div>
            <h2 className="validation--errors--label">Validation errors</h2>
            <div className="validation-errors">
              <ul>
                {errorMsg.map((error, index) => (<li key={index}>{error}</li>))}
              </ul>
            </div>
          </div>
        }
        <div>
          <form>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div>
                  <input id="title" name="title" type="text"
                    className="input-title course--title--input"
                    placeholder="Course title..." value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>
              <div className="course--description">
                <div>
                  <textarea id="description" name="description" className=""
                    placeholder="Course description..." value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div>
                      <input id="estimatedTime" name="estimatedTime" type="text"
                        className="course--time--input" placeholder="Hours"
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(e.target.value)}
                      />
                    </div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea id="materialsNeeded" name="materialsNeeded" className=""
                        placeholder="List materials..." value={materialsNeeded}
                        onChange={(e) => setMaterialsNeeded(e.target.value)}
                      ></textarea>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom">
              <button className="button" type="button" onClick={updateCourse}>Update Course</button>
              <button className="button button-secondary"
                onClick={() => props.history.push({pathname: `/courses/${course.id}`, state: { course: course }})}
              >Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default withRouter(UpdateCourse);