import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addMedicalProcedureCategory,
  deleteCategory,
  fetchCategories,
  getMedicalProceduresByCategory,
  updateMedicalProcedureCategory,
  addMedicalProcedure,
  deleteProcedure,
  updateMedicalProcedure,
} from "../../services/apisMedicalProcedures";

const initialState = {
  categories: [],
  medicalProcedures: {},
  proceduresByCategory: {},
  status: "idle",
  error: null,
};

//GETs

export const fetchMedicalCategories = createAsyncThunk(
  "/fetchMedicalCategories",
  async () => {
    const categories = await fetchCategories();
    return categories;
  }
);

export const fetchMedicalProceduresByCategory = createAsyncThunk(
  "/fetchMedicalProceduresByCategory",
  async (categoryId) => {
    const procedures = await getMedicalProceduresByCategory(categoryId);
    return { categoryId, procedures };
  }
);

//POSTs

export const newMedicalCategory = createAsyncThunk(
  "/posthMedicalProceduresCategory",
  async (categoryData) => {
    return await addMedicalProcedureCategory(categoryData);
  }
);

export const addProcedure = createAsyncThunk(
  "/addProcedure",
  async (procedureData, { rejectWithValue }) => {
    try {
      const response = await addMedicalProcedure(procedureData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//PATCHes

export const patchCategory = createAsyncThunk(
  "/patchCategory",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await updateMedicalProcedureCategory(id, categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const patchMedicalProcedure = createAsyncThunk(
  "/patchMedicalProcedure",
  async ({ id, procedureData }, { rejectWithValue }) => {
    try {
      const response = await updateMedicalProcedure(id, procedureData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//DELETEs

export const deleteCategories = createAsyncThunk(
  "/deleteMedicalProceduresCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteCategory(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProcedures = createAsyncThunk(
  "/deleteProcedures",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteProcedure(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const medicalProceduresSlice = createSlice({
  name: "medicalProcedures",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(newMedicalCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(deleteCategories.fulfilled, (state, action) => {
        const categoryId = action.meta.arg;
        state.categories = state.categories.filter(
          (category) => category.id !== categoryId
        );
        delete state.proceduresByCategory[categoryId];
      })
      .addCase(deleteCategories.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete the category.";
      })
      .addCase(deleteProcedures.fulfilled, (state, action) => {
        const procedureId = action.payload;

        Object.keys(state.proceduresByCategory).forEach((categoryId) => {
          state.proceduresByCategory[categoryId] = state.proceduresByCategory[
            categoryId
          ].filter((procedure) => procedure.id !== procedureId);
        });
      })
      .addCase(fetchMedicalCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchMedicalProceduresByCategory.fulfilled, (state, action) => {
        const { categoryId, procedures } = action.payload;
        state.proceduresByCategory[categoryId] = procedures;
      })
      .addCase(patchCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(patchCategory.rejected, (state, action) => {
        state.error = action.error.message || "Could not update the category.";
      })
      .addCase(addProcedure.fulfilled, (state, action) => {
        const { category, ...procedureData } = action.payload;

        if (!Array.isArray(state.proceduresByCategory[category])) {
          state.proceduresByCategory[category] = [];
        }
        state.proceduresByCategory[category].push(procedureData);
      })

      .addCase(addProcedure.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to add the medical procedure.";
      })

      .addCase(patchMedicalProcedure.fulfilled, (state, action) => {
        const updatedProcedure = action.payload;
        const categoryId = updatedProcedure.category.id;

        if (state.proceduresByCategory[categoryId]) {
          const updatedProcedures = state.proceduresByCategory[categoryId].map(
            (procedure) =>
              procedure.id === updatedProcedure.id
                ? updatedProcedure
                : procedure
          );

          state.proceduresByCategory[categoryId] = updatedProcedures;
        }
      });
  },
});

export default medicalProceduresSlice.reducer;
