import axios from "axios";

export const forgotPassword = (email: string) => {
  const configurations = {
    method: "post",
    url: `${import.meta.env.VITE_API_URL}/user/resend_verification`,
    data: {
      email: email,
    },
  };

  return axios(configurations);
};
