import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Dimension, typeDimension } from "./helper";
import Camera from "./webcam";
function App() {
  return (
    <div className="App">
      <Camera />
    </div>
  );
}

export default App;
