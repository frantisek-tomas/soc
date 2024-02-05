import "./App.css";
import { useEffect } from "react";
import { Routes } from "react-router";
import Recipes from "./pages/recipes/recipes";
import Login from "./pages/login/login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ResetPassword from "./pages/resetpassword/resetpassword";
import Prevention from "./pages/prevention/prevention";
import Messages from "./pages/messages/messages";
import MedicalProcedures from "./pages/medical_procedures/MedicalProcedures";
import Settings from "./pages/settings/settings";
import { setToken } from "./commponents/features/loginSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrivateRoute from "./pages/login/privateRoute";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/recipes"
        element={
          <PrivateRoute>
            <Recipes />
          </PrivateRoute>
        }
      />
      <Route
        path="/prevention"
        element={
          <PrivateRoute>
            <Prevention />
          </PrivateRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <PrivateRoute>
            <Messages />
          </PrivateRoute>
        }
      />
      <Route
        path="/MedicalProcedures"
        element={
          <PrivateRoute>
            <MedicalProcedures />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Login />} />
      <Route path="/resetpassword" element={<ResetPassword />}></Route>
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
