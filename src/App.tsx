// import { useState } from "react";

import Home from "./pages/Home"
import "./App.css";

function App() {
  return (
    <div
      style={{
        backgroundColor: "rgba(34, 40, 49, 0.9)", // <--- semi-transparent
        width: "100%",
        height: "100vh",
      }}
    >
      <Home />
    </div>
  );
}


export default App;
