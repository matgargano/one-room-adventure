import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import LogItem from "../../types/LogItem";

export interface LogStateInterface {
  items: (LogItem | 0)[];
}

const initialState: LogStateInterface = {
  items: [
    {
      input: "",
      message: [
        "I am In the Middle Of A Room",
        "I am sitting on a chair",
        "I am blindfolded",
      ],
    },
  ],
};

export const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    addLog: (state: LogStateInterface, action: PayloadAction<LogItem>) => {
      state.items.push({
        input: action.payload.input,
        message: action.payload.message,
      });
    },
    carriageReturn: (state: LogStateInterface) => {
      state.items.push(0);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addLog, carriageReturn } = logSlice.actions;

export default logSlice.reducer;
