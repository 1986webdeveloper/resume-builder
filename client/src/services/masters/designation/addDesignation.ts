import axios from "axios";

type Inputs = {
  designation: string;
  summary: string;
};

export const addDesignation = (
  token: string | null,
  payload: Inputs,
  type: string | undefined
) => {
  const configurations = {
    method: "post",
    url: `${import.meta.env.VITE_API_URL}/admin/addDesignationSummary`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      name: payload.designation,
      summary: payload.summary,
      type: type?.toUpperCase(),
    },
  };

  return axios(configurations);
};
