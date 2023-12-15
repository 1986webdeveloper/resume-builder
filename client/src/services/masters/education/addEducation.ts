import axios from "axios";

type Inputs = {
  degreeType: string;
  summary: string;
  performance: { label: string; value: string };
};

export const addEducation = (token: string | null, payload: Inputs) => {
  const configurations = {
    method: "post",
    url: `${import.meta.env.VITE_API_URL}/education/addEducation`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  };

  return axios(configurations);
};
