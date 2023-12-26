import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: JSON.parse(localStorage.getItem("formData") as string) || [],
};

export const formDataSlice = createSlice({
  name: "formData",
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      localStorage.setItem("formData", JSON.stringify(action.payload));
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateFormData } = formDataSlice.actions;

export default formDataSlice.reducer;
