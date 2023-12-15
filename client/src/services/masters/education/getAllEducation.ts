import axios from "axios";

export const getAllEducation = (token: string | null) => {
  const configurations = {
    method: "get",
    url: `${import.meta.env.VITE_API_URL}/education/getAllEducationDetails`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(configurations);
};
