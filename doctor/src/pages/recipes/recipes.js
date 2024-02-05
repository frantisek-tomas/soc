import React, { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  getPrescriptions,
  updatePrescription,
} from "../../commponents/features/recipeSlice";
import Sidenav from "../../commponents/sidenav/sidenav";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "./recipes.css";
import { getColumns, customStyles, formatDate } from "./tableColumns";

const Recipes = () => {
  const data = useSelector(({ prescriptions }) => prescriptions.data);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const closeModal = () => setOpen(false);

  const modalRef = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleCheckboxClick = (row) => {
    const updatedRow = {
      ...row,
      doneOn: row.doneOn ? null : new Date().toISOString(),
    };

    dispatch(updatePrescription(updatedRow))
      .then(() => {
        dispatch(getPrescriptions());
      })
      .catch((error) => {
        console.error("Failed to update prescription:", error);
      });
  };

  const columns = getColumns(handleCheckboxClick);

  useEffect(() => {
    dispatch(getPrescriptions());
  }, [dispatch]);

  useEffect(() => {
    const newFilteredData = searchTerm
      ? data.filter((row) =>
          row.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : data;
    setFilteredData(newFilteredData);
  }, [data, searchTerm]);

  return (
    <>
      <div className="container">
        <div className="sidenav-div">
          <Sidenav />
        </div>
        <div className="recipes-header">LIEKY</div>
        <div className="search-container">
          <input
            className="search"
            type="text"
            placeholder="vyhľadajte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="messages-table">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={20}
            paginationComponentOptions={{
              rowsPerPageText: "Záznamov na stránke:",
              rangeSeparatorText: "z",
            }}
            customStyles={customStyles}
            onRowClicked={handleRowClick}
            dense
          />
        </div>
        <div>
          {selectedRow && (
            <Modal
              open={open}
              onClose={closeModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              disableAutoFocus={true}
            >
              <Box>
                <div className="recipes-container">
                  <div className="setting-block" ref={modalRef}>
                    <p className="title"></p>
                    <div className="field-wrapper">
                      <h1 className="label">Meno:</h1>
                      <input className="input" value={selectedRow.name} />
                    </div>
                  </div>

                  <div className="setting-block">
                    <p className="title"></p>
                    <div className="field-wrapper">
                      <h1 className="label">Telefónne číslo:</h1>
                      <input className="input" value={selectedRow.phone} />
                    </div>
                  </div>

                  <div className="setting-block">
                    <p className="title"></p>
                    <form>
                      <div className="field-wrapper">
                        <h1 className="label">Rok narodenia:</h1>
                        <input
                          className="input"
                          value={selectedRow.birthYear}
                        />
                      </div>
                    </form>
                  </div>

                  <div className="setting-block">
                    <p className="title"></p>
                    <div className="field-wrapper">
                      <h1 className="label">Dátum</h1>
                      <input
                        className="input"
                        value={formatDate(selectedRow.createdOn.date)}
                      />
                    </div>
                  </div>

                  <div className="setting-block">
                    <p className="title"></p>
                    {selectedRow.medications.map((medication, index) => (
                      <div key={index}>
                        <div className="field-wrapper">
                          <h1 className="label">Liek:</h1>
                          <input
                            className="input"
                            value={medication.name}
                            readOnly
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="setting-block">
                    <p className="title"></p>
                    {selectedRow.medications.map((medication, index) => (
                      <div key={index}>
                        <div className="field-wrapper">
                          <h1 className="label">Liek:</h1>
                          <input
                            className="input"
                            value={medication.quantity}
                            readOnly
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};

export default Recipes;
