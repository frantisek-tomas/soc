import Navbar from "../commonest/navbar/navbar";
import Footer from "../commonest/footer/footer";
import "../booking/booking.css";
import Calendar from "react-calendar";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  postOrder,
  fetchOccupiedTimes,
  fetchUnavailableDays,
} from "../commonest/features/bookingSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExaminations } from "../commonest/features/bookingSlice";

const Booking = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 6,
    maxHeight: "90vh",
    overflowY: "auto",
  };
  const [dataForCurrentDate, setData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [_, setShowTime] = useState(false);
  const [nameError, setNameError] = useState("");
  const [birthYearError, setBirthYearError] = useState("");
  const [occupiedTimes, setOccupiedTimes] = useState([]);
  const [phoneError, setPhoneError] = useState("");
  const [clickedDate, setClickedDate] = useState(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [unavailableDays, setUnavailableDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatShortWeekday = (locale, date) => {
    const days = [
      "Nedeľa",
      "Pondelok",
      "Utorok",
      "Streda",
      "Štvrtok",
      "Piatok",
      "Sobota",
    ];
    return days[date.getDay()];
  };

  const [summaryDetails, setSummaryDetails] = useState({
    name: "",
    birthYear: "",
    phone: "",
    time: "",
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    setTime("");
  };
  const handleClose = () => {
    setOpen(false);
    setTime("");
    setName("");
    setBirthYear("");
    setPhone("");
    setNameError("");
    setBirthYearError("");
    setPhoneError("");
    setBookingMessage("");
  };
  function adjustDateForBackend(date) {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
    return newDate;
  }

  function handleCalendarChange(e) {
    setDate(e);
    handleOpen();
    const adjustedDate = adjustDateForBackend(e);
    dispatch(fetchOccupiedTimes(adjustedDate))
      .unwrap()
      .then((response) => {
        const occupiedTimesArray = response.times;
        setOccupiedTimes(occupiedTimesArray);
      })
      .catch((error) => {
        console.error("Error fetching occupied times:", error);
      });
    const dataForCurrentDate = getDataForCurrentDate(e);

    setData(dataForCurrentDate);
  }

  const handleMonthChange = ({ activeStartDate, view }) => {
    if (view === "month") {
      setIsLoading(true);
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth() + 1;
      dispatch(fetchUnavailableDays({ year, month }))
        .unwrap()
        .then((days) => {
          setUnavailableDays(days);
        })
        .catch((error) => {
          console.error("Error fetching unavailable days:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adjustedDate = adjustDateForBackend(date);
    const errorsPresent = nameError || birthYearError || phoneError;
    const fieldsAreEmpty = !name || !birthYear || !phone || !time;

    if (errorsPresent || fieldsAreEmpty) {
      alert("Prosím, vyplňte všetky údaje správne pred odoslaním formulára.");
      return;
    }

    try {
      const response = await dispatch(
        postOrder({
          date: adjustedDate,
          name,
          birthYear,
          phone,
          time,
        })
      ).unwrap();

      setSummaryDetails({
        name,
        birthYear,
        phone,
        time,
      });

      setBookingMessage("");

      setOpen(false);
      setShowSummaryModal(true);
      setName("");
      setBirthYear("");
      setPhone("");
      setTime("");

      refreshOccupiedTimes();
    } catch (error) {
      console.error("Error submitting the form: ", error);

      setBookingMessage("Medzičasom sa už objednal niekto iný.");
      setTime("");

      refreshOccupiedTimes();
    }
  };

  const refreshOccupiedTimes = async () => {
    const adjustedDate = adjustDateForBackend(date);
    try {
      const response = await dispatch(
        fetchOccupiedTimes(adjustedDate)
      ).unwrap();
      setOccupiedTimes(response.times);
    } catch (error) {
      console.error("Error fetching updated occupied times: ", error);
    }
  };

  const handleNameChange = (event) => {
    const { value } = event.target;
    if (/^[\p{L}\s]*$/u.test(value)) {
      setName(value);
      setNameError("");
    } else {
      setNameError("Použite iba písmená pre meno a priezvisko.");
    }
  };

  const handleYearChange = (event) => {
    const { value } = event.target;
    if (/^[\d.]*$/.test(value)) {
      setBirthYear(value);
      setBirthYearError("");
    } else {
      setBirthYearError("Zadajte platný rok.");
    }
  };

  const handlePhoneChange = (event) => {
    const { value } = event.target;
    const phoneRegex = /^[+]?[\d\s/]*$/;

    if (phoneRegex.test(value)) {
      setPhone(value);
      setPhoneError("");
    } else {
      setPhoneError("Zadajte platné číslo telefónu.");
    }
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const bookingsData = useSelector(({ bookings }) => bookings);

  function getDataForCurrentDate(date) {
    const newDate = new Date(date);
    return bookingsData.bookings?.filter(
      (booking) =>
        parseInt(booking.day) === newDate.getDate() &&
        parseInt(booking.month) === newDate.getMonth() + 1 &&
        parseInt(booking.year) === newDate.getFullYear()
    );
  }
  useEffect(() => {
    dispatch(getExaminations());
  }, [dispatch]);

  useEffect(() => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    dispatch(fetchUnavailableDays({ year, month }))
      .unwrap()
      .then((days) => {
        setUnavailableDays(days);
      });
  }, [date, dispatch]);

  const examinationAppointment = [
    { value: "7:15", name: "7:15" },
    { value: "7:30", name: "7:30" },
    { value: "7:45", name: "7:45" },
    { value: "8:00", name: "8:00" },
    { value: "8:15", name: "8:15" },
    { value: "8:30", name: "8:30" },
    { value: "8:45", name: "8:45" },
    { value: "9:00", name: "9:00" },
  ];

  return (
    <>
      <Navbar />
      <div className="booking">
        <h1 className="header">Objednanie na preventívnu prehliadku</h1>
        <h3 className="p-booking">Kliknite na dátum a objednajte sa</h3>
        <div className="app">
          <Calendar
            onActiveStartDateChange={handleMonthChange}
            onChange={(e) => handleCalendarChange(e)}
            value={date}
            onClickDay={(clickedDate) => {
              setShowTime(true);
              setClickedDate(clickedDate);
            }}
            formatShortWeekday={formatShortWeekday}
            showWeekNumbers={false}
            tileDisabled={({ date, view }) => {
              if (view === "month") {
                const dayOfMonth = date.getDate();
                return unavailableDays.includes(dayOfMonth);
              }
              return false;
            }}
            tileClassName={({ activeStartDate, date, view }) => {
              const classes = [];
              if (view === "month") {
                if (date.getMonth() !== activeStartDate.getMonth()) {
                  classes.push("other-month-day");
                }
                if (date.getTime() === new Date().setHours(0, 0, 0, 0)) {
                  classes.push(
                    `react-calendar__tile--current ${
                      date.getTime() === clickedDate?.getTime() ? "clicked" : ""
                    }`
                  );
                }
                const dayOfMonth = date.getDate();
                if (unavailableDays.includes(dayOfMonth)) {
                  classes.push("fully-booked");
                }
              }
              return classes.join(" ");
            }}
          />

          <Modal
            className="booking-modal"
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {bookingMessage && (
                <div className="booking-message">{bookingMessage}</div>
              )}
              <h1 className="b-div-h1">Objednávka</h1>
              <div className="info">
                Dátum: {date.getDate()}.{date.getMonth() + 1}.
                {date.getFullYear()}
              </div>
              <div className="b-div-name">
                <TextField
                  className="div-name"
                  required
                  label="Meno a priezvisko"
                  type="text"
                  color="secondary"
                  onChange={handleNameChange}
                  error={!!nameError}
                  helperText={nameError}
                />
              </div>
              <div className="b-div-date">
                <TextField
                  className="div-others"
                  required
                  label="Rok narodenia"
                  type="text"
                  color="secondary"
                  onChange={handleYearChange}
                  error={!!birthYearError}
                  helperText={birthYearError}
                />
              </div>
              <div className="b-div-number">
                <TextField
                  className="div-others"
                  required
                  label="Číslo telefónu"
                  type="text"
                  color="secondary"
                  onChange={handlePhoneChange}
                  error={!!phoneError}
                  helperText={phoneError}
                />
              </div>
              <div>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Čas</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={time}
                    label="Time"
                    onChange={(e) => handleTimeChange(e)}
                    color="secondary"
                  >
                    {examinationAppointment.map((options) => {
                      const isOccupied = occupiedTimes.includes(options.value);
                      return (
                        <MenuItem disabled={isOccupied} value={options.value}>
                          {options.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <button className="button-send-calendar" onClick={handleSubmit}>
                  Odoslať
                </button>
              </div>
            </Box>
          </Modal>
          <Modal
            className="summary-modal"
            open={showSummaryModal}
            onClose={() => setShowSummaryModal(false)}
            aria-labelledby="summary-modal-title"
            aria-describedby="summary-modal-description"
          >
            <Box className="summary-modal-box">
              <button
                className="summary-modal-close-x"
                onClick={() => setShowSummaryModal(false)}
              >
                &times;
              </button>
              <h2 className="summary-modal-header" id="summary-modal-title">
                Potvrdenie objednávky
              </h2>
              <div
                className="summary-modal-content"
                id="summary-modal-description"
              >
                <ul className="summary-modal-list">
                  <li className="summary-modal-list-item">
                    <strong>Meno a priezvisko:</strong> {summaryDetails.name}
                  </li>
                  <li className="summary-modal-list-item">
                    <strong>Rok narodenia:</strong> {summaryDetails.birthYear}
                  </li>
                  <li className="summary-modal-list-item">
                    <strong>Číslo telefónu:</strong> {summaryDetails.phone}
                  </li>
                  <li className="summary-modal-list-item">
                    <strong>Čas:</strong> {summaryDetails.time}
                  </li>
                </ul>
              </div>
              <button
                className="summary-modal-close-btn"
                onClick={() => setShowSummaryModal(false)}
              >
                Zatvoriť
              </button>
            </Box>
          </Modal>
        </div>
      </div>

      <div className="div-footer-b">
        <Footer />
      </div>
    </>
  );
};

export default Booking;
