import React from "react";
import "react-pro-sidebar/dist/css/styles.css";
import AppRouter from "./components/AppRouter";
import AppSideBar from "./components/AppSideBar";
import { BrowserRouter as Router } from "react-router-dom";

function App() {


  return (
    <Router>
      <div>
        <AppSideBar />
        <AppRouter />
      </div>
    </Router>
  );
}

export default App;