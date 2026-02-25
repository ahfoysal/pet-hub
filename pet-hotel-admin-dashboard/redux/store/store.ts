import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/slice/authSlice";
import uiReducer from "../features/slice/uiSlice";
import socketReducer from "../features/slice/socketSlice";
import { baseApi } from "../features/api/baseApi";

// Create store function
export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      socket: socketReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

// Initialize store singleton
let store: ReturnType<typeof makeStore>;

// Get store instance
export const getStore = () => {
  if (typeof window === "undefined") {
    // SSR - new store per request
    return makeStore();
  }
  if (!store) store = makeStore(); // Client singleton
  return store;
};

// Types
const tempStore = makeStore();
export type RootState = ReturnType<typeof tempStore.getState>;
export type AppDispatch = typeof tempStore.dispatch;
