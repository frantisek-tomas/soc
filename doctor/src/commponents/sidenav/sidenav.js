import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../commponents/features/loginSlice";
import "./sidenav.css";
import { NavLink } from "react-router-dom";
import recipe from "../images/recipe-icon.png";
import preventive from "../images/preventive-icon.png";
import message from "../images/message-icon.png";
import logoutIcon from "../images/logout-icon.png";
import settings from "../images/settings-icon.png";
import procedures from "../images/procedures-icon.png";

const Sidenav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <div className="main">
        <div className="logo"></div>
        <hr className="line"></hr>
        <div className="nav-container">
          <div className="nav-wrapper">
            <NavLink
              to="/recipes"
              className={({ isActive }) =>
                isActive ? "active sidebar-link-btn" : "sidebar-link-btn"
              }
            >
              <img src={recipe} alt="recipe-icon"></img>
              <p>LIEKY</p>
            </NavLink>
            <NavLink
              to="/prevention"
              className={({ isActive }) =>
                isActive ? "active sidebar-link-btn" : "sidebar-link-btn"
              }
            >
              <img src={preventive} alt="preventive-icon"></img>
              <p>PREVENTÍVNE</p>
            </NavLink>
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                isActive ? "active sidebar-link-btn" : "sidebar-link-btn"
              }
            >
              <img src={message} alt="messages-icon"></img>
              <p>SPRÁVY</p>
            </NavLink>
            <NavLink
              to="/MedicalProcedures"
              className={({ isActive }) =>
                isActive ? "active sidebar-link-btn" : "sidebar-link-btn"
              }
            >
              <img src={procedures} alt="procedures-icon"></img>
              <p>CENNÍK</p>
            </NavLink>
          </div>
          <div className="nav-wrapper">
            <hr className="line"></hr>
            <div className="nav-wrapper">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? "active sidebar-link-btn" : "sidebar-link-btn"
                }
              >
                <img src={settings} alt="settings-icon"></img>
                <p>NASTAVENIA</p>
              </NavLink>

              <button className="sidebar-link-btn" onClick={handleLogout}>
                <img src={logoutIcon} alt="logout-icon"></img>
                <p>ODHLÁSIŤ SA</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidenav;
