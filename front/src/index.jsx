// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "mapbox-gl/dist/mapbox-gl.css";
import { Buffer } from "buffer";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

window.Buffer = Buffer;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // redux를 사용하기위해 Provider 추가
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
