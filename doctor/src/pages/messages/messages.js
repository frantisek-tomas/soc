import React, { useEffect, useState } from "react";
import { markMessageAsRead } from "../../commponents/features/messageSlice";
import DataTable from "react-data-table-component";
import DeleteIcon from "../../commponents/images/delete-icon.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getMessages,
  deleteMessage,
} from "../../commponents/features/messageSlice";
import "./message.css";
import Sidenav from "../../commponents/sidenav/sidenav";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.toLocaleDateString()}`;
};

const Messages = () => {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const handleDeleteOpen = () => setDeleteOpen(true);
  const handleDeleteClose = () => setDeleteOpen(false);

  const data = useSelector(({ message }) => message.data);
  const [searchTerm, setSearchTerm] = React.useState("");
  const dispatch = useDispatch();

  const filteredData = searchTerm
    ? data.filter((row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data;

  const [open, setOpen] = React.useState(false);
  const handleOpen = (row) => {
    if (!row || typeof row.id === "undefined") {
      return;
    }

    setOpen(true);
    setRow({
      ...row,
      createdOn: formatDate(row.createdOn?.date),
    });

    if (!row.isRead) {
      dispatch(markMessageAsRead(row.id));
    }
  };

  const handleClose = () => setOpen(false);
  const [row, setRow] = React.useState({
    name: null,
    email: null,
    message: null,
    createdOn: null,
  });

  const handleDeleteClick = () => {
    if (rowToDelete) {
      dispatch(deleteMessage(rowToDelete.id))
        .unwrap()
        .then(() => {
          dispatch(getMessages());
          setRowToDelete(null);
          handleDeleteClose();
        })
        .catch((error) => {
          console.error("Failed to delete message:", error);
        });
    }
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.isRead,
      style: {
        backgroundColor: "white",
      },
    },
    {
      when: (row) => !row.isRead,
      style: (row) => ({
        backgroundColor: "#EFECF1",
      }),
    },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#BBBFCA",
    p: 4,
  };

  const commonCellStyle = (row) => {
    return {
      color: "#495464",
      fontSize: "17px",
      borderRight: "1px solid #495464",
      borderBottom: "1px solid #495464",
    };
  };

  const columns = [
    {
      name: "Meno",
      selector: (row) => row.name,
      width: "300px",
      style: {
        ...commonCellStyle(row),
        borderLeft: "1px solid #495464",
      },
    },
    {
      name: "Email",
      selector: (row) => row.email,
      width: "300px",
      style: {
        ...commonCellStyle(row),
      },
    },
    {
      name: "Dátum",
      selector: (row) => formatDate(row.createdOn.date),
      style: {
        ...commonCellStyle(row),
      },
    },

    {
      cell: (row) => (
        <button onClick={(e) => handleOpen(row)} className="button-message">
          obsah
        </button>
      ),
      width: "150px",
      allowOverflow: true,
      button: true,
      style: {
        ...commonCellStyle(row),
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
          row={row}
        >
          <img className="delete-icon" src={DeleteIcon} alt="Delete" />
        </button>
      ),
      allowOverflow: true,
      width: "150px",
      button: true,
      style: {
        ...commonCellStyle(row),
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

  const [rowToDelete, setRowToDelete] = useState(null);

  useEffect(() => {
    dispatch(getMessages());
  }, [dispatch]);

  return (
    <>
      <div className="container">
        <div className="sidenav-div">
          <Sidenav />
        </div>
        <div className="recipes-header">SPRÁVY</div>

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
            conditionalRowStyles={conditionalRowStyles}
          />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="first-grid">
                <div className="name">Meno :</div>
                <input className="input" value={row?.name}></input>
                <div className="name">Email :</div>
                <input className="input" value={row?.email}></input>
              </div>
              <div className="first-grid-4">
                <div className="name">Správa :</div>
                <textarea
                  className="input-message"
                  value={row?.message}
                ></textarea>
              </div>
              <div className="buttons">
                <button className="close-j" onClick={handleClose}>
                  zavrieť
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
              <button className="close" onClick={handleDeleteClick}>
                Áno
              </button>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Messages;
