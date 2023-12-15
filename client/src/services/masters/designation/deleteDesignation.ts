import axios from "axios";

export const deleteDesignation = (token: string | null, id: string) => {
  const configurations = {
    method: "post",
    url: `${import.meta.env.VITE_API_URL}/admin/updateDesignationOrSummary`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      designationId: id,
      active: false,
    },
  };

  return axios(configurations);
};
