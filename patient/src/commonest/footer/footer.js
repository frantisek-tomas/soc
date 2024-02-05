import "../footer/footer.css";
import dovera from "../img/dovera.png";
import union from "../img/union.png";
import vszp from "../img/vszp.png";
import phone from "../img/phone.png";
import email from "../img/email.png";
import address from "../img/address.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSettings } from "../features/settingsSlice";

const Footer = () => {
  const settings = useSelector((state) => state.settings.data);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  return (
    <div className="footer">
      <div className="section-1">
        <h2>Personál</h2>
        {settings &&
          settings.staff.map((person) => (
            <p key={person.id}>
              {person.name} &nbsp;
              {person.classification}
            </p>
          ))}
      </div>
      <div className="section-2">
        <h2>Ordinačné hodiny</h2>
        {settings && (
          <>
            <div className="space">
              <div>Pondelok</div>
              <div>{settings.officeHours.monday}</div>
            </div>
            <hr />
            <div className="space">
              <div>Utorok</div>
              <div>{settings.officeHours.tuesday}</div>
            </div>
            <hr />
            <div className="space">
              <div>Streda</div>
              <div>{settings.officeHours.wednesday}</div>
            </div>
            <hr />
            <div className="space">
              <div>Štvrtok</div>
              <div>{settings.officeHours.thursday}</div>
            </div>
            <hr />
            <div className="space">
              <div>Piatok</div>
              <div>{settings.officeHours.friday}</div>
            </div>
          </>
        )}
      </div>
      <div className="section-3">
        <h2>Kontakt</h2>
        {settings && (
          <>
            <p>
              <img className="icons" src={phone} alt="phone" />{" "}
              <a
                href={`tel:${settings.contact.phone}`}
                className="no-decoration"
              >
                {settings.contact.phone}
              </a>
            </p>
            <p>
              <img className="icons" src={email} alt="email" />{" "}
              <a
                href={`mailto:${settings.contact.email}`}
                className="no-decoration"
              >
                {settings.contact.email}
              </a>
            </p>
            <p>
              <img className="icons" src={address} alt="address" />{" "}
              {settings.contact.city}, {settings.contact.street},{" "}
              {settings.contact.postalCode}
            </p>
          </>
        )}
      </div>
      <div className="section-4">
        <h2>Poisťovne</h2>
        <img className="logos" src={dovera} alt="dovera" />
        <img className="logos" src={vszp} alt="vszp" />
        <img className="logos" src={union} alt="union" />
      </div>
    </div>
  );
};

export default Footer;
