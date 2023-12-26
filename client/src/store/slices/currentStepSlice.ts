import { createSlice } from "@reduxjs/toolkit";

interface stepTypes {
  value: string;
  id: string;
}

const initialState: stepTypes = {
  value: localStorage.getItem("currentStep") || "personal",
  id: localStorage.getItem("currentStepId") || "",
};

export const currentStepSlice = createSlice({
  name: "currentStep",
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.value = action.payload.value;
      state.id = action.payload.id;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentStep } = currentStepSlice.actions;

export default currentStepSlice.reducer;
