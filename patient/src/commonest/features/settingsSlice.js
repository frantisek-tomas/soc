import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: true,
    data: null,
};

export const getSettings = createAsyncThunk(
    '/settings',
    () => {
        return axios
            .get('/settings')

            .then((response) => response.data);
    }
)

const settingSlice = createSlice({
    name: 'settings',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getSettings.pending, (state) => {
            state.loading = true
        });
        builder.addCase(getSettings.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
        });
        builder.addCase(getSettings.rejected, (state) => {
            state.loading = false
        });
    },
});

export default settingSlice.reducer