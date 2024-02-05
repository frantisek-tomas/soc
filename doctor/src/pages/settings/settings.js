import React, { useEffect, useState } from "react";
import Sidenav from "../../commponents/sidenav/sidenav";
import { useSelector, useDispatch } from "react-redux";
import Checkbox from "../settings/checkbox";
import "./setting.css";
import axios from "axios";
import { getBaseUrl } from "../../services/baseModifier";

const App = () => {
  const dispatch = useDispatch();
  const [jsonData, setJsonData] = useState({
    id: 1,
    officeName: "",
    staff: [
      {
        id: 1,
        name: "",
        classification: "",
      },
      {
        id: 3,
        name: "",
        classification: "",
      },
    ],
    contact: {
      id: 1,
      phone: "",
      email: "",
      city: "",
      street: "",
      postalCode: "",
      mapLocation: "",
    },
    officeHours: {
      id: 1,
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
    },
  });

  const token = useSelector((state) => state.login.token);

  useEffect(() => {
    const axiosInstance = axios.create({
      baseURL: getBaseUrl(),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    axiosInstance
      .get("/settings")
      .then((response) => response.data)
      .then((data) => setJsonData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [token]);

  const handleUpdateData = () => {
    if (jsonData) {
      const axiosInstance = axios.create({
        baseURL: getBaseUrl(),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      axiosInstance
        .patch("/settings", jsonData)
        .then((response) => {
          if (response.status === 204) {
            localStorage.setItem("jsonData", JSON.stringify(jsonData));
          } else {
            console.error("Failed to update data");
          }
        })
        .catch((error) => console.error("Error updating data:", error));
    }
  };

  const handleInputChange = (e, key) => {
    const updatedData = { ...jsonData };
    let keys = key.split(".");
    let current = updatedData;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = e.target.value;
    setJsonData(updatedData);
  };

  return (
    <div className="container">
      <div className="sidenav-div">
        <Sidenav />
      </div>
      <div className="recipes-header">NASTAVENIA</div>
      {jsonData ? (
        <div className="settings-container">
          <div className="setting-block">
            <p className="title">Kontaktné informácie</p>
            <div className="field-wrapper">
              <h1 className="label">Telefón:</h1>
              <input
                className="input"
                type="text"
                value={jsonData.contact.phone}
                onChange={(e) => handleInputChange(e, "contact.phone")}
              />
            </div>
            <div className="field-wrapper">
              <h1 className="label">Email:</h1>
              <input
                className="input"
                type="email"
                value={jsonData.contact.email}
                onChange={(e) => handleInputChange(e, "contact.email")}
              />
            </div>
            <div className="field-wrapper">
              <h1 className="label">Mesto:</h1>
              <input
                className="input"
                type="text"
                value={jsonData.contact.city}
                onChange={(e) => handleInputChange(e, "contact.city")}
              />
            </div>
            <div className="field-wrapper">
              <h1 className="label">Ulica:</h1>
              <input
                className="input"
                type="text"
                value={jsonData.contact.street}
                onChange={(e) => handleInputChange(e, "contact.street")}
              />
            </div>
            <div className="field-wrapper">
              <h1 className="label">PSČ:</h1>
              <input
                className="input"
                type="text"
                value={jsonData.contact.postalCode}
                onChange={(e) => handleInputChange(e, "contact.postalCode")}
              />
            </div>
          </div>

          <div className="setting-block">
            <p className="title">Otváracie hodiny</p>
            <div className="field-wrapper">
              <h1 className="label">Pondelok:</h1>
              <input
                className="input"
                type="text"
                value={jsonData.officeHours.monday}
                onChange={(e) => handleInputChange(e, "officeHours.monday")}
              />
            </div>
            <div className="field-wrapper">
              <h1 className="label">Utorok:</h1>
              <input
                className="input"
                type="text"
                value={jsonData.officeHours.tuesday}
                onChange={(e) => handleInputChange(e, "officeHours.tuesday")}
              />
            </div>
            <div className="field-wrapper">
              <h1 className="label">Streda:</h1>
              <input
                className="input"
                type="text"
                value={jsonData.officeHours.wednesday}
                onChange={(e) => handleInputChange(e, "officeHours.wednesday")}
              />
            </div>
            <div className="field-wrapper">
              <h1 className="label">Štvrtok:</h1>
              <input
                className="input"
                type="text"
                value={jsonData.officeHours.thursday}
                onChange={(e) => handleInputChange(e, "officeHours.thursday")}
              />
            </div>
            <div className="field-wrapper">
              <h1 className="label">Piatok:</h1>
              <input
                className="input"
                type="text"
                value={jsonData.officeHours.friday}
                onChange={(e) => handleInputChange(e, "officeHours.friday")}
              />
            </div>
          </div>

          <div className="tools-div">
            <Checkbox label="Všeobecná zdravotná poisťovňa" checked={true} />
            <Checkbox label="Dôvera" checked={true} />
            <Checkbox label="Union" checked={true} />
          </div>

          <div className="setting-block">
            <p className="title">Zamestnanci</p>
            <div className="field-wrapper">
              <h1 className="label">Lekár:</h1>
              <input
                className="input"
                type="text"
                value={jsonData.staff[0].name}
                onChange={(e) => handleInputChange(e, "staff.0.name")}
              />
            </div>
            <div className="field-wrapper">
              <h1 className="label">Sestra:</h1>
              <input
                className="input"
                type="text"
                value={jsonData.staff[1].name}
                onChange={(e) => handleInputChange(e, "staff.1.name")}
              />
            </div>
          </div>

          <div className="setting-block">
            <p className="title">Lokácia google</p>
            <div className="field-wrapper">
              <h1 className="label">URL:</h1>
              <input
                className="input"
                type="text"
                value={jsonData.contact.mapLocation}
                onChange={(e) => handleInputChange(e, "contact.mapLocation")}
              />
            </div>
          </div>
          <div>
            <button onClick={handleUpdateData} className="submit-button">
              Uložiť zmeny
            </button>
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default App;
