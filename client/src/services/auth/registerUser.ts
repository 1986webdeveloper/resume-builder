import axios from "axios";

interface Inputs {
  firstName: string;
  lastName: string;
  email: string;
}

export const registerUser = (payload: Inputs) => {
  const configurations = {
    method: "post",
    url: `${import.meta.env.VITE_API_URL}/user/createUser`,
    data: {
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
    },
  };

  return axios(configurations);
};
