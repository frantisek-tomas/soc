import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
axios.defaults.baseURL = JSON.parse(process.env.REACT_APP_APIS)[
  window.location.hostname.split(".")[0]
];
console.log(window.location.hostname.split(".")[0]);
// axios.defaults.baseURL = process.env.REACT_APP_API;
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
