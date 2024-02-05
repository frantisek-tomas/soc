import Navbar from "../commonest/navbar/navbar";
import Footer from "../commonest/footer/footer";
import '../recipe/recipe.css';
import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postRecipe } from '../commonest/features/recipeSlice';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const Recipe = () => {

    const [medications, setMedications] = useState([]);
    const [name, setName] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [phone, setPhone] = useState('');
  
    const responseMedical = useSelector((state) => state.recipe.messages);
  
    const dispatch = useDispatch();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(
        postRecipe({
          name,
          birthYear,
          phone,
          medications,
        })
      );
    };
    const handleNameChange = (event) => {
      setName(event.target.value);
    };
    const handleBirthYearChange = (event) => {
      setBirthYear(parseInt(event.target.value));
    };
    const handlePhoneChange = (event) => {
      setPhone(event.target.value);
    };
    const handleMedicationChange = (index, value) => {
      setMedications(
        medications.map((item, itemIndex) =>
          itemIndex === index ? { ...item, medication: value } : item
        )
      );
    };
    const handleQuantityChange = (index, value) => {
      setMedications(
        medications.map((item, itemIndex) =>
          itemIndex === index ? { ...item, quantity: parseInt(value) } : item
        )
      );
    };
  
    function handleClick() {
      setMedications([
        ...medications,
        { medication: '', quantity: 0, id: Math.random() },
      ]);
    }
  
    const removeItem = (index) => {
      setMedications(medications.filter((_, itemIndex) => itemIndex !== index));
    };

    return(
        <>
        <Navbar/>
        <div className="recipe">
        <h1 className="header-about">Objednávka liekov</h1>
            <Box
              sx={{
                mb: 2,
              }}
            >
              <TextField
                className="recipe-name-input"
                required
                label="Meno a priezvisko"
                type="text"
                color="secondary"
                onChange={handleNameChange}
              />
            </Box>
            <div className="recipe-grid">
            <div>
              <Box
                sx={{
                  mb: 2,
                }}
              >
                <TextField
                  className="birth-text"
                  type="text"
                  color="secondary"
                  label="Rok narodenia"
                  onChange={handleBirthYearChange}
                />

              </Box>
              </div>
              <div className="phone-div-recipe">
              <Box
                sx={{
                  mb: 2,
                }}
              >
                <TextField
                  className="phone-text"
                  type="text"
                  color="secondary"
                  label="Telefónne číslo"
                  onChange={handlePhoneChange}
                />
              </Box>
              </div>
              </div>
              {medications.map((medication, index) => (
                <div key={medication.id}>
                  <div className="recipe-grid2">
                    <TextField
                      className="input-medication"
                      placeholder="Názov lieku"
                      color="secondary"
                      onChange={(event) =>
                        handleMedicationChange(index, event.target.value)
                      }
                    ></TextField>
                    <TextField
                      onChange={(event) =>
                        handleQuantityChange(index, event.target.value)
                      }
                      className="input-number"
                      placeholder="počet"
                      color="secondary"
                      type="number"
                    ></TextField>
                    <button
                      className="button-delete"
                      onClick={() => removeItem(index)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            <div className="buttons-div">
            <button onClick={handleClick} className="button-add">
              Pridať liek
            </button>
              <button className="button-send" onClick={handleSubmit}>
                Odoslať
              </button>
            </div>
            {responseMedical && <div className="div-respon">{responseMedical}</div>}
        </div>
        <div className="div-footer">
        <Footer/>
        </div>
        </>
    );
}

export default Recipe;