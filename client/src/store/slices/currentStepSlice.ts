import { createSlice } from "@reduxjs/toolkit";

interface stepsTypes {
  sectionID: string;
  slug: string;
  resumeId: string;
}

const initialState: stepsTypes = {
  slug:
    JSON.parse(localStorage.getItem("currentStep") as string)?.slug ||
    "personal",
  sectionID:
    JSON.parse(localStorage.getItem("currentStep") as string)?.sectionID || "",
  resumeId:
    JSON.parse(localStorage.getItem("currentStep") as string)?.resumeId || "",
};

export const currentStepSlice = createSlice({
  name: "currentStep",
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.slug = action.payload?.slug;
      state.sectionID = action.payload?.sectionID;
      if (action.payload?.resumeId)
        state.resumeId = action.payload?.resumeId || "";
      localStorage.setItem("currentStep", JSON.stringify(state));
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentStep } = currentStepSlice.actions;

export default currentStepSlice.reducer;
