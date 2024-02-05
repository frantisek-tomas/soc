import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: true,
  data: [],
  error: '',
};

export const getMedicalProcedures = createAsyncThunk(
  'prices/medicalProcedures',
  () => {
    return axios
      .get('/medicalProcedures',)

      .then((response) => response.data.categories);
  }
);

const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getMedicalProcedures.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getMedicalProcedures.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = '';
    });
    builder.addCase(getMedicalProcedures.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.data = 'Správa nebola odoslaná';
    });
  },
});

export default pricesSlice.reducer;
