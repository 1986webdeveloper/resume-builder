import axios from "axios";

interface payloadTypes {
  summary: string;
  type: string | undefined;
  name: string | undefined;
}

export const addSummary = (token: string | null, payload: payloadTypes) => {
  const configurations = {
    method: "post",
    url: `${import.meta.env.VITE_API_URL}/admin/addDesignationSummary`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  };

  return axios(configurations);
};
