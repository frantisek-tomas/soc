import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.login.token);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in local storage or Redux state
    const storedToken = localStorage.getItem("token") || token;

    if (!storedToken) {
      // Redirect to login if no token is found
      navigate("/");
    }
  }, [token, navigate]);

  // Render children (the protected component) if the token exists
  return token ? children : null;
};

export default PrivateRoute;
