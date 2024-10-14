import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "./features/inventory/inventorySlice";
import locationReducer from "./features/inventory/locationSlice";
import informationReducer from "./features/inventory/informationSlice";
export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    location: locationReducer,
    information: informationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
