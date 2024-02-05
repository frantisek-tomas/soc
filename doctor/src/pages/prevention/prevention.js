import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import DeleteIcon from "../../commponents/images/delete-icon.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getPreventios,
  deletePrevention,
  updatePreventionData,
} from "../../commponents/features/preventionSlice";
import Sidenav from "../../commponents/sidenav/sidenav";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./prevention.css";
import moment from "moment";
import { getBaseUrl } from "../../services/baseModifier";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#BBBFCA",
  p: 4,
};

const Prevention = () => {
  const dispatch = useDispatch();
  const data = useSelector(({ prevention }) => prevention.data);
  const [occupiedSlots, setOccupiedSlots] = useState({ times: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [row, setRow] = useState({
    name: null,
    phone: null,
    birthYear: null,
    appointmentDate: null,
    createdOn: null,
    medications: null,
    timeOn: null,
  });
  const [rowToDelete, setRowToDelete] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    dispatch(getPreventios());
  }, [dispatch]);

  const fetchOccupiedSlots = async (date2) => {
    try {
      const response = await fetch(
        `${getBaseUrl()}/preventiveExaminationTimesForDay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: date2 }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const occupiedTimes = await response.json();
      setOccupiedSlots({ times: occupiedTimes.times });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (row?.appointmentDate) {
      fetchOccupiedSlots(row.appointmentDate);
    }
  }, [row?.appointmentDate]);

  useEffect(() => {
    setFilteredData(processData(data, searchTerm));
  }, [data, searchTerm]);

  useEffect(() => {}, [occupiedSlots]);

  useEffect(() => {
    if (selectedDate) {
      fetchOccupiedSlots(selectedDate);
    }
  }, [selectedDate]);

  const token = useSelector((state) => state.login.token);
  const handleSaveAndClose = async () => {
    const formattedDateTime = `${row.appointmentDate}T${row.timeOn}:00.000Z`;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${getBaseUrl()}/preventiveExamination/${row.id}`,
        {
          id: row.id,
          date: formattedDateTime,
          time: row.timeOn,
          name: row.name,
          phone: row.phone,
          birthYear: row.birthYear,
        },
        config
      );
      dispatch(getPreventios());

      handleClose();
    } catch (error) {
      console.error("Error updating preventive examination time:", error);
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setRow((prevRow) => ({
      ...prevRow,
      appointmentDate: newDate,
      timeOn: "time",
    }));
    fetchOccupiedSlots(newDate);
  };

  const handleDeleteClick = () => {
    if (rowToDelete) {
      dispatch(deletePrevention(rowToDelete.id));
      setRowToDelete(null);
      handleDeleteClose();
    }
  };

  const handleTimeOnChange = (newDateTime) => {
    const timePart = newDateTime.split(" ")[1];

    if (!occupiedSlots.times.includes(timePart)) {
      setRow((prevRow) => ({
        ...prevRow,
        timeOn: timePart,
      }));
    }
  };

  const handleOpen = (row) => {
    setOpen(true);
    setRow({
      ...row,
      appointmentDate: formatAppointmentDate(
        row.yearOn,
        row.monthOn,
        row.dayOn
      ),
      createdOn: formatDate(row.createdOn.date),
    });
    const displayDate = moment(
      formatAppointmentDate(row.yearOn, row.monthOn, row.dayOn)
    ).format("YYYY-MM-DD");
    setSelectedDate(displayDate);
  };

  const handleClose = () => setOpen(false);

  const handleDropdownOpen = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  const handleDeleteOpen = () => setDeleteOpen(true);
  const handleDeleteClose = () => setDeleteOpen(false);

  const processData = (data, searchTerm) => {
    const sortedData = sortAppointmentsByFutureDate([...data]);

    if (searchTerm) {
      return sortedData.filter((row) => {
        const nameMatch = row.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(searchTerm);
        const dateStr = formatAppointmentDate(
          row.yearOn,
          row.monthOn,
          row.dayOn
        ).replace(/\s+/g, "");
        return nameMatch || dateStr.includes(searchTerm);
      });
    }
    return sortedData;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const formatAppointmentDate = (year, month, day) => {
    const date = new moment(`${year}-${month}-${day}`);
    return `${year}-${month}-${day}`;
  };

  const sortAppointmentsByFutureDate = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(`${a.yearOn}-${a.monthOn}-${a.dayOn}`);
      const dateB = new Date(`${b.yearOn}-${b.monthOn}-${b.dayOn}`);
      return dateB - dateA;
    });
  };

  const timeSlots = [
    "7:15",
    "7:30",
    "7:45",
    "8:00",
    "8:15",
    "8:30",
    "8:45",
    "9:00",
  ];
  const columns = [
    {
      name: "Meno",
      selector: (row) => row.name,
      width: "100",
      style: {
        color: "#495464",
        fontSize: "17px",
        borderRight: "1px solid #495464",
        borderLeft: "1px solid #495464",
        borderBottom: "1px solid #495464",
      },
    },
    {
      name: "Tel. číslo",
      selector: (row) => row.phone,
      style: {
        color: "#495464",
        fontSize: "17px",
        borderRight: "1px solid #495464",
        borderBottom: "1px solid #495464",
      },
    },
    {
      name: "Dátum narodenia",
      selector: (row) => row.birthYear,
      style: {
        color: "#495464",
        fontSize: "17px",
        borderRight: "1px solid #495464",
        borderBottom: "1px solid #495464",
      },
    },
    {
      name: "Dátum prehliadky",
      sortable: true,
      selector: (row) => {
        const formattedDate = formatAppointmentDate(
          row.yearOn,
          row.monthOn,
          row.dayOn
        );
        const [year, month, day] = formattedDate.split("-").map(Number);
        return `${String(day).padStart(2, "0")}.${String(month).padStart(
          2,
          "0"
        )}.${year}`;
      },
      style: {
        color: "#495464",
        fontSize: "17px",
        borderRight: "1px solid #495464",
        borderBottom: "1px solid #495464",
      },
    },
    {
      name: "Čas",
      sortable: true,
      selector: (row) => row.timeOn,
      style: {
        color: "#495464",
        fontSize: "17px",
        borderRight: "1px solid #495464",
        borderBottom: "1px solid #495464",
      },
    },
    {
      cell: (row) => (
        <button
          onClick={(e) => handleOpen(row)}
          className="button-message"
          row={row}
        >
          zobraziť
        </button>
      ),
      width: "150px",
      allowOverflow: true,
      button: true,
      style: {
        borderBottom: "1px solid #495464",
        borderRight: "1px solid #495464",
      },
    },
    {
      cell: (row) => (
        <button
          onClick={() => {
            setRowToDelete(row);
            handleDeleteOpen();
          }}
          className="button-delete"
        >
          <img className="delete-icon" src={DeleteIcon} alt="Delete" />
        </button>
      ),
      width: "150px",
      allowOverflow: true,
      button: true,
      style: {
        borderBottom: "1px solid #495464",
        borderRight: "1px solid #495464",
      },
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        color: "#495464",
        fontSize: "20px",
        borderBottom: "1px solid #495464",
        borderLeft: "1px solid #495464",
        borderRight: "1px solid #495464",
      },
    },
  };

  return (
    <>
      <div className="container">
        <div className="sidenav-div">
          <Sidenav />
        </div>
        <div className="recipes-header">PREVENTÍVNE</div>
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
            dense
          />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="modal-container">
                <div className="">
                  <div className="m-label">Meno</div>
                  <input className="m-input" value={row?.name}></input>
                  <div className="m-label">Rok nar.</div>
                  <input className="m-input" value={row?.birthYear}></input>
                </div>
                <div className="">
                  <div className="m-label">Tel. číslo</div>
                  <input className="m-input" value={row?.phone}></input>
                  <div className="m-label">Zo dňa</div>
                  <input className="m-input" value={row?.createdOn}></input>
                </div>
                <div className="">
                  <div className="m-label">Dátum prehliadky</div>
                  <input
                    type="date"
                    className="m-input"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                  />

                  <div className="">
                    <div className="m-label">Čas</div>
                    <select
                      className="m-input-time"
                      value={row?.timeOn}
                      onChange={(e) =>
                        handleTimeOnChange(
                          `${row.appointmentDate} ${e.target.value}`
                        )
                      }
                    >
                      <option value="time" disabled hidden>
                        Zvoľte čas
                      </option>

                      {timeSlots.map((time) => (
                        <option
                          key={time}
                          value={time}
                          disabled={occupiedSlots.times.includes(time)}
                        >
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="buttons">
                <button className="close" onClick={handleSaveAndClose}>
                  uložiť
                </button>
              </div>
            </Box>
          </Modal>
          <Modal
            open={deleteOpen}
            onClose={handleDeleteClose}
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
          >
            <Box sx={style}>
              <h2 className="delete-text">Vymazať?</h2>
              <button className="close" onClick={handleDeleteClose}>
                Nie
              </button>

              <button
                className="close"
                onClick={() => {
                  handleDeleteClick();
                }}
              >
                Áno
              </button>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Prevention;
