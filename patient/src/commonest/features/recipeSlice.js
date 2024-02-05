import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: true,
  messages: null,
  error: '',
};

export const postRecipe = createAsyncThunk(
  'recipe/prescription',
  ({ name, birthYear, phone, medications }) => {
    return axios
      .post(
        '/prescription',
        { name, birthYear, phone, medications },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Credentials': 'true',
          },
        }
      )

      .then((response) => response.data);
  }
);

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(postRecipe.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(postRecipe.fulfilled, (state) => {
      state.loading = false;
      state.messages = 'Správa bola odoslaná';
      state.error = '';
    });
    builder.addCase(postRecipe.rejected, (state, data) => {
      state.loading = false;
      state.error = data.error.message;
      state.messages = 'Správa nebola odoslaná';
    });
  },
});

export default recipeSlice.reducer;
