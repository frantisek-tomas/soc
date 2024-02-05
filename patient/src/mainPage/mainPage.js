import Navbar from "../commonest/navbar/navbar";
import Footer from "../commonest/footer/footer";
import '../mainPage/mainPage.css'
import { Link } from "react-router-dom";
import arrow from "../img/Icon_ionic-ios-arrow-round-back.png";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getSettings} from "../commonest/features/settingsSlice";

const Mainpage = () => {
  const settings = useSelector(state => state.settings.data);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSettings())
  }, [dispatch]);

  return(
  <>
    <Navbar />
    <div className="mainpage">
        <div className="header">
          {settings && (
            <>
              <h1>{settings.officeName}</h1>
              <h3>všeobecný lekár</h3>
            </>
          )}
        </div>
        <div className="mainpage-grid">
          
          <Link to='/recipe-request'>
          <div className="child-1">
            <h2>Recept</h2>
            <p className="p-black">Odoslanie žiadosti o vystavenie receptu.</p>
            <img src={arrow} alt="arrow" />
          </div>
          </Link>

          <Link to='/booking'>
          <div className="child-2">
            <h2>Preventívna prehliadka</h2>
            <p className="p-black">Odoslanie žiadosti o termín preventívnej prehliadky.</p>
            <img src={arrow} alt="arrow" />
          </div>
          </Link>

        </div>
    </div>
    <Footer />
  </>
  );
}

export default Mainpage;