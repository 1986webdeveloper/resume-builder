import { fieldTypes } from "../types/fieldTypes";

export const loginFields: fieldTypes[] = [
  {
    labelText: "Email address",
    labelFor: "email-address",
    id: "email",
    name: "email",
    type: "text",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email address",
    pattern: /^[^\s]+@[^\s]+\.[a-zA-Z]{2,}$/,
  },
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    isRequired: true,
    placeholder: "Password",
    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
  },
];

export const signupFields: fieldTypes[] = [
  {
    labelText: "First Name",
    labelFor: "firstName",
    id: "firstName",
    name: "firstName",
    type: "text",
    autoComplete: "firstName",
    isRequired: true,
    placeholder: "First Name",
    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
  },
  {
    labelText: "Last Name",
    labelFor: "lastName",
    id: "lastName",
    name: "lastName",
    type: "text",
    autoComplete: "lastName",
    isRequired: true,
    placeholder: "Last Name",
    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
  },
  {
    labelText: "Email",
    labelFor: "email-address",
    id: "email",
    name: "email",
    type: "text",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email address",
    pattern: /^[^\s]+@[^\s]+\.[a-zA-Z]{2,}$/,
  },
];

export const passwordFields: fieldTypes[] = [
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    isRequired: true,
    placeholder: "Password",
    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
  },
  {
    labelText: "Confirm Password",
    labelFor: "confirm-password",
    id: "confirmPassword",
    name: "confirm-password",
    type: "password",
    autoComplete: "confirm-password",
    isRequired: true,
    placeholder: "Confirm Password",
    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
  },
];

export const personalForm = [
  {
    labelText: "Full Name",
    labelFor: "full_name",
    id: "full_name",
    name: "full_name",
    type: "text",
    autoComplete: "full_name",
    isRequired: true,
    placeholder: "Full Name",
    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
  },
  {
    labelText: "Email",
    labelFor: "email",
    id: "email",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email",
    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
  },
  {
    labelText: "Country",
    labelFor: "country",
    id: "country",
    name: "country",
    type: "dropdown",
    autoComplete: "country",
    isRequired: true,
    placeholder: "Country",
    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
  },
  {
    labelText: "State",
    labelFor: "state",
    id: "state",
    name: "state",
    type: "dropdown",
    autoComplete: "state",
    isRequired: true,
    placeholder: "State",
    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
  },

  {
    labelText: "City",
    labelFor: "city",
    id: "city",
    name: "city",
    type: "dropdown",
    autoComplete: "city",
    isRequired: true,
    placeholder: "city",
    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
  },
  {
    labelText: "Mobile No",
    labelFor: "mobileNo",
    id: "mobileNo",
    name: "mobileNo",
    type: "number",
    autoComplete: "mobileNo",
    isRequired: true,
    placeholder: "Mobile No",
    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
  },
  {
    labelText: "Address",
    labelFor: "address",
    id: "address",
    name: "address",
    type: "text",
    autoComplete: "address",
    isRequired: true,
    placeholder: "Address",
    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
  },
  {
    labelText: "DOB",
    labelFor: "dob",
    id: "dob",
    name: "dob",
    type: "date",
    autoComplete: "dob",
    isRequired: true,
    placeholder: "DOB",
    pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
  },
];
