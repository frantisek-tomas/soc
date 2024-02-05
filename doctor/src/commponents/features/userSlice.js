import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: null,
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    },
  },
});

export const { setUserData } = userSlice.actions;
export const selectUser = (state) => state.user.data;
export default userSlice.reducer;
