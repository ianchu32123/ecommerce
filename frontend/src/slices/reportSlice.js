import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSalesReport = createAsyncThunk(
  "report/fetchSalesReport",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("/api/reports/sales");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    dailySales: {},
    categorySales: {},
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.dailySales = action.payload.dailySales;
        state.categorySales = action.payload.categorySales;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reportSlice.reducer;
