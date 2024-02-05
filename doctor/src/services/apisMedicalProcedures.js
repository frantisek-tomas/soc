import axios from "axios";
import { getBaseUrl } from "./baseModifier";

const baseUrl = getBaseUrl();

//GETs

export const fetchCategories = async () => {
  const baseUrl = getBaseUrl();
  const response = await axios.get(`${baseUrl}/medicalProceduresCategory`);
  return response.data.categories;
};

export const getMedicalProceduresByCategory = async (Id) => {
  const response = await axios.get(
    `${baseUrl}/medicalProcedure/category/${Id}`
  );
  return response.data.medicalProcedures;
};

// POSTs

export const addMedicalProcedure = async (procedureData) => {
  const response = await axios.post(
    `${baseUrl}/medicalProcedure`,
    procedureData
  );
  return response.data;
};

export const addMedicalProcedureCategory = async (categoryData) => {
  const response = await axios.post(
    `${baseUrl}/medicalProceduresCategory`,
    categoryData
  );
  return response.data;
};

// PATCHes
export const updateMedicalProcedureCategory = async (id, categoryData) => {
  const response = await axios.patch(
    `${baseUrl}/medicalProceduresCategory/${id}`,
    categoryData
  );
  return response.data;
};

// PATCH a Medical Procedure by ID
export const updateMedicalProcedure = async (id, procedureData) => {
  const response = await axios.patch(
    `${baseUrl}/medicalProcedure/${id}`,
    procedureData
  );
  return response.data;
};

//DELETEs

export const deleteCategory = async (id) => {
  const baseUrl = getBaseUrl();
  const response = await axios.delete(
    `${baseUrl}/medicalProceduresCategory/${id}`
  );
  return response.data;
};

export const deleteProcedure = async (id) => {
  const response = await axios.delete(`${baseUrl}/medicalProcedure/${id}`);
  return response.data;
};
