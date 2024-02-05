import './App.css';
import Prices from './prices/prices';
import Recipe from './recipe/recipe';
import Booking from './booking/booking';
import About from './about/about';
import { Routes, Route } from 'react-router';
import MainPage from './mainPage/mainPage';
import { ThemeProvider } from '@mui/material';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/prices" element={<Prices />}></Route> 
        <Route path="/recipe-request" element={<Recipe />}></Route>
        <Route path="/booking" element={<Booking />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
