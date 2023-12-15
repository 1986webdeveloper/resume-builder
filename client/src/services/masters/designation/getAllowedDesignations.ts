import axios from "axios";

export const getAllowedDesignations = (token: string | null) => {
  const configurations = {
    method: "get",
    url: `${import.meta.env.VITE_API_URL}/admin/getAllowedDesignation`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(configurations);
};
