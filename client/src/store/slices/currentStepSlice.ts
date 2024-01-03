import { createSlice } from "@reduxjs/toolkit";

interface stepsTypes {
  sectionID: string;
  slug: string;
  resumeId: string;
  _id: string;
  title: string;
}

const initialState: stepsTypes = {
  slug:
    JSON.parse(localStorage.getItem("currentStep") as string)?.slug ||
    "personal",
  sectionID:
    JSON.parse(localStorage.getItem("currentStep") as string)?.sectionID || "",
  resumeId:
    JSON.parse(localStorage.getItem("currentStep") as string)?.resumeId || "",
  _id: JSON.parse(localStorage.getItem("currentStep") as string)?._id || "",
  title:
    JSON.parse(localStorage.getItem("currentStep") as string)?.title ||
    "Personal Details",
};

export const currentStepSlice = createSlice({
  name: "currentStep",
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.slug = action.payload?.slug;
      state.sectionID = action.payload?.sectionID;
      state._id = action.payload?._id;
      if (action.payload?.resumeId)
        state.resumeId = action.payload?.resumeId || "";
      if (action.payload?.title) state.title = action.payload?.title || "";
      localStorage.setItem("currentStep", JSON.stringify(state));
    },
    clearSteps: (state) => {
      state.slug = "personal";
      state.sectionID = "";
      state.resumeId = "";
      state._id = "";
      localStorage.removeItem("currentStep");
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentStep, clearSteps } = currentStepSlice.actions;

export default currentStepSlice.reducer;
