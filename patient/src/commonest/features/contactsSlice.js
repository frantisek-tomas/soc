import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: true,
  messages: null,
  error: '',
};

export const postMessage = createAsyncThunk(
  'contacts/message',
  ({ name, email, message }) => {
    return axios
      .post(
        '/message',
        { name, email, message },
      )

      .then((response) => response.data);
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(postMessage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(postMessage.fulfilled, (state, data) => {
      state.loading = false;
      state.messages = 'Správa bola odoslaná';
      state.error = '';
    });
    builder.addCase(postMessage.rejected, (state, data) => {
      state.loading = false;
      state.error = data.error.message;
      state.messages = 'Správa nebola odoslaná';
    });
  },
});

export default contactsSlice.reducer;
