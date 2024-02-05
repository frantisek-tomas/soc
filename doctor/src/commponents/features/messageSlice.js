import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getBaseUrl } from "../../services/baseModifier";

const initialState = {
  loading: true,
  data: [],
  error: "",
};

export const getMessages = createAsyncThunk(
  "message/getMessages",
  async (_, { getState }) => {
    try {
      const token = getState().login.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${getBaseUrl()}/message`, config);
      return response.data.messages;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "message/deleteMessage",
  async (messageId, { getState }) => {
    try {
      const token = getState().login.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${getBaseUrl()}/message/${messageId}`, config);
      return messageId;
    } catch (error) {
      throw error;
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  "message/markMessageAsRead",
  async (messageId, { getState }) => {
    try {
      const token = getState().login.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(`${getBaseUrl()}/message/${messageId}`, {}, config);
      return messageId;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const deletedMessageId = action.payload;
        state.data = state.data.filter(
          (message) => message.id !== deletedMessageId
        );
      })
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const messageId = action.payload;
        const message = state.data.find((m) => m.id === messageId);
        if (message) {
          message.isRead = true;
        }
      })

      .addCase(markMessageAsRead.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default messageSlice.reducer;
