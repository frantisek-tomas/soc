import { SdStorageTwoTone } from "@mui/icons-material";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";

const initialState = {
  loading: true,
  data: [],
  error: "",
  unavailableDays: [],
};

export const postOrder = createAsyncThunk(
  "order/preventiveExamination",
  ({ date, name, birthYear, phone, time }) => {
    return axios
      .post("/preventiveExamination", { date, name, birthYear, phone, time })

      .then((response) => response.data);
  }
);

export const getExaminations = createAsyncThunk(
  "order/preventiveExaminations",
  () => {
    return axios
      .get("/preventiveExaminations")

      .then((response) => response.data.bookings);
  }
);

export const fetchOccupiedTimes = createAsyncThunk(
  "order/fetchOccupiedTimes",
  async (selectedDate) => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    const response = await axios.post("/preventiveExaminationTimesForDay", {
      date: formattedDate,
    });
    return response.data;
  }
);

export const fetchUnavailableDays = createAsyncThunk(
  "order/fetchUnavailableDays",
  async ({ year, month }) => {
    const response = await axios.get(
      `/preventiveExaminationUnavailableDaysForMonth/${year}/${month}`
    );
    const unavailableDays = response.data.days.map((dateStr) => {
      return moment(dateStr, "YYYY-MM-DD").date();
    });
    return unavailableDays;
  }
);

const bookingSlice = createSlice({
  name: "order",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(postOrder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(postOrder.fulfilled, (state) => {
      state.loading = false;
      state.messages = "Správa bola odoslaná";
      state.error = "";
    });
    builder.addCase(postOrder.rejected, (state, data) => {
      state.loading = false;
      state.error = data.error.message;
      state.messages = "Správa nebola odoslaná";
    });
    builder.addCase(getExaminations.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getExaminations.fulfilled, (state, action) => {
      state.loading = false;
      state.messages = "Správa bola odoslaná";
      state.bookings = action.payload;
      state.error = "";
    });
    builder.addCase(getExaminations.rejected, (state, data) => {
      state.loading = false;
      state.error = data.error.message;
      state.messages = "Správa nebola odoslaná";
    });
    builder.addCase(fetchUnavailableDays.fulfilled, (state, action) => {
      state.unavailableDays = action.payload;
    });
  },
});

export default bookingSlice.reducer;
