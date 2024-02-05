import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMedicalCategories,
  fetchMedicalProceduresByCategory,
  deleteCategories,
  newMedicalCategory,
  patchCategory,
  addProcedure,
  deleteProcedures,
  patchMedicalProcedure,
} from "../../commponents/features/MedicalProceduresSlice";
import "./MedicalProcedures.css";
import Sidenav from "../../commponents/sidenav/sidenav";
import { unwrapResult } from "@reduxjs/toolkit";

const MedicalProcedures = () => {
  const [key, setKey] = useState(0);
  const dispatch = useDispatch();
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { categories, proceduresByCategory } = useSelector(
    (state) => state.medicalProcedures
  );
  const isEditing = !!editingCategory;
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newProcedureName, setNewProcedureName] = useState("");
  const [newProcedurePrice, setNewProcedurePrice] = useState("");
  const [modalProcedureName, setModalProcedureName] = useState("");
  const [modalProcedurePrice, setModalProcedurePrice] = useState("");
  const [originalProcedures, setOriginalProcedures] = useState({});
  const [procedureChanges, setProcedureChanges] = useState({});

  useEffect(() => {
    dispatch(fetchMedicalCategories());
  }, [dispatch]);

  useEffect(() => {
    categories.forEach((category) => {
      if (!proceduresByCategory[category.id]) {
        dispatch(fetchMedicalProceduresByCategory(category.id));
      }
    });
  }, [categories, dispatch, proceduresByCategory]);

  const handleSaveChanges = async () => {
    if (editingCategory && editingCategory.id) {
      try {
        if (
          editingCategory.name !== originalProcedures[editingCategory.id]?.name
        ) {
          await dispatch(
            patchCategory({
              id: editingCategory.id,
              categoryData: { name: editingCategory.name },
            })
          );
        }

        const patchPromises = Object.entries(procedureChanges).map(
          ([procedureId, changes]) => {
            if (Object.keys(changes).length > 0) {
              return dispatch(
                patchMedicalProcedure({
                  id: procedureId,
                  procedureData: changes,
                })
              );
            }
            return Promise.resolve();
          }
        );

        await Promise.all(patchPromises);
      } catch (err) {
        console.error("Error during save changes: ", err);
      } finally {
        setEditingCategory(null);
        setProcedureChanges({});
      }
    }
  };

  const handleChange = (procedureId, field, value) => {
    const updatedProcedures = editingCategory.procedures.map((proc) => {
      if (proc.id === procedureId) {
        return { ...proc, [field]: value };
      }
      return proc;
    });

    setEditingCategory({ ...editingCategory, procedures: updatedProcedures });

    setProcedureChanges((prevChanges) => ({
      ...prevChanges,
      [procedureId]: { ...prevChanges[procedureId], [field]: value },
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;

    const parsedCategoryId = parseInt(categoryId, 10);

    const category = categories.find((cat) => cat.id === parsedCategoryId);
    const procedures = proceduresByCategory[parsedCategoryId] || [];

    if (category) {
      setEditingCategory({ ...category, procedures: [...procedures] });
      setOriginalProcedures(
        procedures.reduce((acc, procedure) => {
          acc[procedure.id] = procedure;
          return acc;
        }, {})
      );
      setProcedureChanges({});
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleDeleteClick = async (categoryId) => {
    if (
      window.confirm(
        "Ste si istí, že chcete odstrániť túto kategóriu a všetok jej obsah?"
      )
    ) {
      try {
        const proceduresToDelete = proceduresByCategory[categoryId];

        if (proceduresToDelete) {
          for (const procedure of proceduresToDelete) {
            await dispatch(deleteProcedures(procedure.id));
          }
        }

        await dispatch(deleteCategories(categoryId));

        dispatch(fetchMedicalCategories());
      } catch (error) {
        console.error("Error deleting category or procedures: ", error);
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategoryName.trim() === "") {
      console.error("Category name cannot be empty.");
      return;
    }

    try {
      const categoryResult = await dispatch(
        newMedicalCategory({ name: newCategoryName })
      );
      const newCategoryId = unwrapResult(categoryResult).id;

      if (
        modalProcedureName.trim() !== "" &&
        modalProcedurePrice.trim() !== ""
      ) {
        await dispatch(
          addProcedure({
            name: modalProcedureName,
            category: newCategoryId,
            price: modalProcedurePrice,
          })
        );
      }

      setNewCategoryName("");
      setModalProcedureName("");
      setModalProcedurePrice("");
      setIsModalOpen(false);

      dispatch(fetchMedicalCategories());
    } catch (err) {
      console.error("Failed to add the category or procedure: ", err);
    }
  };

  const handleAddNewProcedure = async () => {
    if (!newProcedureName || !newProcedurePrice) {
      console.error("Procedure name and price are required.");
      return;
    }

    try {
      await dispatch(
        addProcedure({
          name: newProcedureName,
          price: newProcedurePrice,
          category: editingCategory.id,
        })
      );

      const updatedProcedures = await dispatch(
        fetchMedicalProceduresByCategory(editingCategory.id)
      ).unwrap();

      setEditingCategory({
        ...editingCategory,
        procedures: updatedProcedures.procedures,
      });

      setNewProcedureName("");
      setNewProcedurePrice("");
      setKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Failed to add procedure: ", error);
    }
  };

  const handleDeleteProcedure = async (procedureId) => {
    if (window.confirm("Ste si istí, že chcete odstrániť túto procedúru?")) {
      try {
        await dispatch(deleteProcedures(procedureId));
        const updatedProcedures = editingCategory.procedures.filter(
          (proc) => proc.id !== procedureId
        );
        setEditingCategory({
          ...editingCategory,
          procedures: updatedProcedures,
        });
        dispatch(fetchMedicalProceduresByCategory(editingCategory.id));
      } catch (error) {
        console.error("Failed to delete procedure: ", error);
      }
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Sidenav />
      <div className="medical-procedures-container">
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </span>
              <h2>Vytvoriť novú kategóriu</h2>
              <form onSubmit={handleAddCategory}>
                <input
                  type="text"
                  className="edit-category-name"
                  placeholder="Názov kategórie"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <div className="procedure-price-container">
                  <input
                    type="text"
                    className="edit-procedure-name"
                    placeholder="Názov procedúry"
                    value={modalProcedureName}
                    onChange={(e) => setModalProcedureName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="edit-procedure-price"
                    placeholder="Cena"
                    value={modalProcedurePrice}
                    onChange={(e) => setModalProcedurePrice(e.target.value)}
                  />
                </div>
                <div className="button-group">
                  <button type="submit" className="save-changes-button">
                    Pridať kategóriu
                  </button>
                  <button
                    type="button"
                    className="cancel-changes-button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Zrušiť
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <header className="header-with-dropdown">
          <h1 className="category-title">Cenník nehradených výkonov</h1>
          <div className="dropdown-button-container">
            <select
              className="category-dropdown"
              value={editingCategory ? editingCategory.id : ""}
              onChange={handleCategoryChange}
            >
              <option value="" disabled>
                Kategórie
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button className="new-category-button" onClick={handleOpenModal}>
              Pridať novú kategóriu
            </button>
          </div>
        </header>

        {categories.map((category) => (
          <section key={category.id} className="category-section">
            <div className="category-header">
              {isEditing && editingCategory.id === category.id ? (
                <div className="edit-category-name-container">
                  <input
                    type="text"
                    className="edit-category-name"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                  />
                  <span
                    className="category-delete-button"
                    onClick={() => handleDeleteClick(category.id)}
                  >
                    &times;
                  </span>
                </div>
              ) : (
                <h2 className="category-title">{category.name}</h2>
              )}
            </div>
            {proceduresByCategory[category.id]?.map((proc) => (
              <div key={proc.id} className="procedure-item">
                {isEditing && editingCategory?.id === category.id ? (
                  <>
                    <input
                      className="edit-procedure-name"
                      type="text"
                      value={
                        editingCategory.procedures.find((p) => p.id === proc.id)
                          ?.name || ""
                      }
                      onChange={(e) =>
                        handleChange(proc.id, "name", e.target.value)
                      }
                    />
                    <input
                      className="edit-procedure-price"
                      type="text"
                      value={
                        editingCategory.procedures.find((p) => p.id === proc.id)
                          ?.price || ""
                      }
                      onChange={(e) =>
                        handleChange(proc.id, "price", e.target.value)
                      }
                    />
                    <span
                      className="procedure-delete-button"
                      onClick={() => handleDeleteProcedure(proc.id)}
                    >
                      &times;
                    </span>
                  </>
                ) : (
                  <p>
                    {proc.name} - {proc.price}
                  </p>
                )}
              </div>
            ))}
            {isEditing && editingCategory.id === category.id && (
              <div className="button-group">
                <input
                  type="text"
                  placeholder="Napíšte novú procedúru sem..."
                  className="new-procedure-input"
                  value={newProcedureName}
                  onChange={(e) => setNewProcedureName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Cena"
                  className="edit-new-price"
                  value={newProcedurePrice}
                  onChange={(e) => setNewProcedurePrice(e.target.value)}
                />
                <button
                  className="save-changes-button"
                  onClick={handleSaveChanges}
                >
                  Uložiť zmeny
                </button>
                <button
                  onClick={handleAddNewProcedure}
                  className="add-procedure-button"
                >
                  Pridať novú procedúru
                </button>
                <button
                  className="cancel-changes-button"
                  onClick={handleCancelEdit}
                >
                  Zrušiť
                </button>
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  );
};

export default MedicalProcedures;
