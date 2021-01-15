import React from "react";
import Header from "./Header";
import "../App.css";

//500 error. route is /error
function UnhandledError() {
  return (
    <>
      <Header />
      <div className="bounds">
        <h1>Error</h1>
        <p>Sorry! We just encountered an unexpected error.</p>
      </div>
    </>
  );
}

export default UnhandledError;