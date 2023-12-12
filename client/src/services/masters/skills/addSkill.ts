import axios from "axios";

type Inputs = {
  name: string;
};

export const addSkill = (token: string | null, payload: Inputs) => {
  const configurations = {
    method: "post",
    url: `${import.meta.env.VITE_API_URL}/skills/addSkills`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  };

  return axios(configurations);
};
