import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface LogStateInterface {
  items: string[];
}

const initialState: LogStateInterface = {
  items: [],
};

export const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    addLog: (state: LogStateInterface, action: PayloadAction<string>) => {
      state.items.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addLog } = logSlice.actions;

export default logSlice.reducer;
