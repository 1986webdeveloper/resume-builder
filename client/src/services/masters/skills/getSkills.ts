import axios from "axios";

export const getSkills = (token: string | null, id: string | null = "") => {
  const configurations = {
    method: "get",
    url: `${import.meta.env.VITE_API_URL}/skills/getAllSkills`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(configurations);
};
