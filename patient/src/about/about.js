import Navbar from "../commonest/navbar/navbar";
import Footer from "../commonest/footer/footer";
import '../about/about.css';
import { useDispatch, useSelector } from 'react-redux';
import {useEffect, useState} from 'react';
import { postMessage } from '../commonest/features/contactsSlice';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import pointer from '../img/map-point-cross.svg';
import {getSettings} from "../commonest/features/settingsSlice";

const About = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const settings = useSelector(state => state.settings.data);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSettings())
    }, [dispatch]);

  const responseMessage = useSelector((state) => state.contacts.messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      postMessage({
        name,
        email,
        message,
      })
    );
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <>
        <Navbar />
        <div className="div-message">
            <h1 className="h1-div-about">Kontakt</h1>
            <div className="grid-div-about">
                <div className="grid-child1">
                    <img src={pointer} alt="pointer" />
                    {settings && (
                        <>
                            <h3 className="h3-about">{settings.contact.city}</h3>
                            <p className="p-div">{settings.contact.street}</p>
                            <p className="p-div">{settings.contact.city}, {settings.contact.postalCode}</p>
                            <p className="p-div">
                                Email:{" "}
                                <a
                                    href={`mailto:${settings.contact.email}`}
                                    className="no-decoration-about"
                                >
                                    {settings.contact.email}
                                </a>
                            </p>
                            <p className="p-div">
                                Telefon:{" "}
                                <a
                                    href={`tel:${settings.contact.phone}`}
                                    className="no-decoration-about"
                                >
                                    {settings.contact.phone}
                                </a>
                            </p>
                        </>
                    )}
                </div>
                <div className="grid-child2">
                    {settings && (
                        <iframe
                            title="google maps"
                            src={settings.contact.mapLocation}
                            width="100%"
                            height="300"
                            style={{ border: "0" }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    )}
                </div>
            </div>

            <h2 className="div-h2">Ak máte dotaz, napíšte nám správu.</h2>
            <div className="grid-div-about1">
                <label>
                    <div className="grid-child11">
                        <Box sx={{ mb: 1 }}>
                            <TextField
                                className="name-input"
                                type="text"
                                color="secondary"
                                label="Meno a priezvisko"
                                onChange={handleNameChange}
                            ></TextField>
                        </Box>
                    </div>
                </label>
                <label>
                    <div className="grid-child12">
                        <TextField
                            className="email-input"
                            type="text"
                            label="Email"
                            color="secondary"
                            onChange={handleEmailChange}
                        ></TextField>
                    </div>
                </label>
            </div>
            <div>
                <TextField
                    className="message-input"
                    multiline
                    label="Správa"
                    color="secondary"
                    rows={5}
                    onChange={handleMessageChange}
                ></TextField>
            </div>
            <div>
                <button className="about-button" onClick={handleSubmit}>
                    Odoslať
                </button>
                {responseMessage && <div className="div-respon">{responseMessage}</div>}
            </div>
        </div>
        <Footer />
    </>
    );
};

export default About;