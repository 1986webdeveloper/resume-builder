import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  personalFormTypes,
  designationFormTypes,
  experienceFormTypes,
  educationFormTypes,
  skillsFormTypes,
} from "../../types/formTypes";

const formData = JSON.parse(localStorage.getItem("formData") as string);

interface FormType {
  personal: personalFormTypes[];
  designation: designationFormTypes[];
  experience: experienceFormTypes[];
  education: educationFormTypes[] | any;
  skills: skillsFormTypes[];
}

interface PayloadType {
  key: string;
  value: any;
}

const initialState: FormType = {
  personal: formData?.personal || [],
  designation: formData?.designation || [],
  experience: formData?.experience || [],
  education: formData?.education || [],
  skills: formData?.skills || [],
};

export const formDataSlice = createSlice({
  name: "formData",
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      const { key, value }: PayloadType = action.payload;
      // Check if the key exists in the initialState
      if (state.hasOwnProperty(key)) {
        // Update the specific state property based on the key
        (state as any)[key] = value;
      }
      localStorage.setItem("formData", JSON.stringify(state));
    },
    setFormData: (state, action: PayloadAction<PayloadType[]>) => {
      // Initialize all keys with empty values
      Object.keys(state).forEach((key) => {
        state[key as keyof FormType] = Array.isArray((state as any)[key])
          ? []
          : {};
      });
      action.payload.forEach(({ key, value }) => {
        // Ensure the key exists in the state
        if (state.hasOwnProperty(key)) {
          (state as any)[key] = value;
        }
      });
      localStorage.setItem("formData", JSON.stringify(state));
    },
    clearFormData: (state) => {
      state.personal = [];
      state.designation = [];
      state.experience = [];
      state.education = [];
      state.skills = [];
      localStorage.removeItem("formData");
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateFormData, setFormData, clearFormData } =
  formDataSlice.actions;

export default formDataSlice.reducer;
