import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import currentStepReducer from "./slices/currentStepSlice";
import formDataReducer from "./slices/formDataSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    currentStep: currentStepReducer,
    formData: formDataReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
