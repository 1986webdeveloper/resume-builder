import { createSlice } from "@reduxjs/toolkit";

interface stepTypes {
  value: string;
  id: string;
}

const initialState: stepTypes = {
  value:
    JSON.parse(localStorage.getItem("currentStep") as string)?.value ||
    "personal",
  id: JSON.parse(localStorage.getItem("currentStep") as string)?.id || "",
};

export const currentStepSlice = createSlice({
  name: "currentStep",
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.value = action.payload.value;
      state.id = action.payload.id;
      localStorage.setItem("currentStep", JSON.stringify(state));
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentStep } = currentStepSlice.actions;

export default currentStepSlice.reducer;
