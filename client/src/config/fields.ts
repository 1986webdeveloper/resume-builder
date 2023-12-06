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

// export { loginFields, signupFields };
