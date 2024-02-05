import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getBaseUrl } from "../../services/baseModifier";

const initialState = {
  loading: true,
  data: [],
  error: "",
};

export const getPrescriptions = createAsyncThunk(
  "prescriptions",
  async (_, { getState }) => {
    try {
      const token = getState().login.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${getBaseUrl()}/prescription`, config);

      return response.data.prescriptions;
    } catch (error) {
      throw error;
    }
  }
);

export const updatePrescription = createAsyncThunk(
  "prescriptions/update",
  async (updatedRow, { getState }) => {
    const token = getState().login.token;
    const response = await axios.post(
      `${getBaseUrl()}/prescription/${updatedRow.id}`,
      updatedRow,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }
);

const recipeSlice = createSlice({
  name: "prescriptions",
  initialState,
  reducers: {
    getPrescriptionsSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    },
    updatePrescriptionSuccess: (state, action) => {
      state.data = state.data.map((prescription) =>
        prescription.id === action.payload.id ? action.payload : prescription
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPrescriptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPrescriptions.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getPrescriptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(updatePrescription.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePrescription.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.map((prescription) =>
        prescription.id === action.payload.id ? action.payload : prescription
      );
    });
    builder.addCase(updatePrescription.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { getPrescriptionsSuccess, updatePrescriptionSuccess } =
  recipeSlice.actions;
export default recipeSlice.reducer;
