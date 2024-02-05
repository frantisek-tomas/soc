import { useState } from "react";

const Checkbox = ({ label }) => {
  const [isChecked, setIsChecked] = useState(true);
  return (
    <div className="checkbox-wrapper">
      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked((prev) => !prev)}
          className={isChecked ? "checked" : ""}
        />
        <span>{label}</span>
      </label>
    </div>
  );
};
export default Checkbox;
