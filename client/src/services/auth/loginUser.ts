import axios from "axios";

type Inputs = {
  email: string;
  password: string;
};

export const loginUser = (payload: Inputs) => {
  const configurations = {
    method: "post",
    url: `${import.meta.env.VITE_API_URL}/user/login`,
    data: {
      email: payload.email,
      password: payload.password,
    },
  };

  return axios(configurations);
};
