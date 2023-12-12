import axios from "axios";

export const getDesignations = (
  token: string | null,
  id: string | null = ""
) => {
  const configurations = {
    method: "get",
    url: `${
      import.meta.env.VITE_API_URL
    }/admin/getDesignationOrSummaryList?designationId=${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(configurations);
};
