import axios from "axios";

export const resetPassword = (password: string, token: string | null) => {
  const configurations = {
    method: "post",
    url: `${import.meta.env.VITE_API_URL}/user/reset_password`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      password: password,
    },
  };

  return axios(configurations);
};
