import axios from "axios";

export const verify = (token: string | null) => {
  const configurations = {
    method: "get",
    url: `${import.meta.env.VITE_API_URL}/user/verifyOTP`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(configurations);
};
