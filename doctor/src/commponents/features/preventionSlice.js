import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getBaseUrl } from "../../services/baseModifier";

const initialState = {
  loading: true,
  data: [],
  error: "",
};

export const getPreventios = createAsyncThunk(
  "prevetion",
  async (_, { getState }) => {
    try {
      const token = getState().login.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${getBaseUrl()}/preventiveExamination`,
        config
      );
      return response.data.preventiveExaminations;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
);

export const deletePrevention = createAsyncThunk(
  "prevetion/deletePrevention",
  async (itemId, { getState }) => {
    try {
      const token = getState().login.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(
        `${getBaseUrl()}/preventiveExamination/${itemId}`,
        config
      );
      return itemId;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
);

const prevetionSlice = createSlice({
  name: "prevetion",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getPreventios.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPreventios.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getPreventios.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(deletePrevention.fulfilled, (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
    });
  },
});

export default prevetionSlice.reducer;
