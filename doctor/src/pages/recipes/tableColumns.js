import "../settings/setting.css";

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const handleMedicationDisplay = (medications) => {
  if (medications.length === 1) {
    return `${medications[0].name} - ${medications[0].quantity}`;
  } else if (medications.length > 1) {
    return "Viac ako jeden liek!";
  }
  return "Nothing";
};

export const getColumns = (handleCheckboxClick) => [
  {
    name: "Meno",
    selector: (row) => row.name,
    width: "300px",
    style: {
      color: "#495464",
      fontSize: "17px",
      borderRight: "1px solid #495464",
      borderLeft: "1px solid #495464",
      borderBottom: "1px solid #495464",
    },
  },
  {
    name: "Tel.číslo",
    selector: (row) => row.phone,
    width: "300px",
    style: {
      color: "#495464",
      fontSize: "17px",
      borderRight: "1px solid #495464",
      borderBottom: "1px solid #495464",
    },
  },
  {
    name: "Rok narodenia",
    selector: (row) => row.birthYear,
    style: {
      color: "#495464",
      fontSize: "17px",
      borderRight: "1px solid #495464",
      borderBottom: "1px solid #495464",
    },
  },
  {
    name: "Dátum",
    selector: (row) => formatDate(row.createdOn.date),
    style: {
      color: "#495464",
      fontSize: "17px",
      borderBottom: "1px solid #495464",
    },
  },
  {
    name: "Lieky",
    cell: (row) => handleMedicationDisplay(row.medications),
    style: {
      color: "#495464",
      fontSize: "17px",
      borderBottom: "1px solid #495464",
    },
  },
  {
    name: "Vybavené",
    cell: (row) => (
      <div className="checkbox-wrapper" style={{ justifyContent: "center" }}>
        <input
          type="checkbox"
          checked={!!row.doneOn}
          onChange={() => handleCheckboxClick(row)}
          className={`checkbox-field ${row.doneOn ? "checked" : ""}`}
        />
      </div>
    ),
    width: "150px",
    style: {
      borderBottom: "1px solid #495464",
      borderRight: "1px solid #495464",
      display: "flex",
      justifyContent: "center",
      row: {
        cursor: "pointer",
      },
    },
  },
];

export const customStyles = {
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
