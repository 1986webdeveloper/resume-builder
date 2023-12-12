import axios from "axios";

export const getDesignationsWiseSummaries = (
  token: string | null,
  id: string | null = "",
  type: string
) => {
  const configurations = {
    method: "get",
    url: `${
      import.meta.env.VITE_API_URL
    }/admin/getDesignationOrSummaryList?designationId=${id}&type=${type.toUpperCase()}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(configurations);
};
