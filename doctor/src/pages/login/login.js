import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  setToken,
} from "../../commponents/features/loginSlice";
import { setUserData } from "../../commponents/features/userSlice";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getBaseUrl } from "../../services/baseModifier";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginStart());
    const baseUrl = getBaseUrl();

    const loginApi = `${baseUrl}/login`;

    const loginData = {
      email: email,
      password: password,
    };

    axios
      .post(loginApi, loginData)
      .then((response) => {
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        setAuthToken(token);

        dispatch(loginSuccess(user));
        dispatch(setUserData(user));
        dispatch(setToken(token));
        navigate("/messages");
      })
      .catch((error) => {
        dispatch(loginFailure(error.message));
        if (error.response && error.response.status === 401) {
          setErrorMessage("Nesprávne prihlasovacie údaje");
        } else {
          setErrorMessage(error.response.data.message || "Login failed");
        }

        console.error("Error:", error);
      });
  };

  return (
    <>
      <div className="login-background">
        <form onSubmit={(event) => handleLogin(event)}>
          <div className="content">
            <div className="login-header">Medicity</div>
            <div className="login-pod-header">Prihláste sa do svojho účtu</div>
            <div className="login-email">Email</div>
            <input
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="login-password">Heslo</div>
            <input
              className="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && (
              <p
                style={{
                  color: "red",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                {errorMessage}
              </p>
            )}

            <div className="login-forgetpassword">
              <a href="/forgottenpassword" className="link">
                Zabudli ste heslo ?
              </a>
            </div>
            <button className="login-button" type="submit">
              prihlásiť sa
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
