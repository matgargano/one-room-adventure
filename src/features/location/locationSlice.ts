import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { directionType } from "../../types/directionType";
import { Locations } from "../../const/locations";
export interface LocationState {
  direction: directionType;
  room: Locations;
}

const initialState: LocationState = {
  direction: "north",
  room: "main",
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setDirection: (
      state: LocationState,
      action: PayloadAction<directionType>
    ) => {
      state.direction = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDirection } = locationSlice.actions;

export default locationSlice.reducer;
