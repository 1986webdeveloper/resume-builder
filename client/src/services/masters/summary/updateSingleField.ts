import axios from "axios";

interface payloadTypes {
  summaryId: string;
  designationId: string;
  title: string;
}

export const updateSingleField = (
  token: string | null,
  payload: payloadTypes
) => {
  const configurations = {
    method: "post",
    url: `${import.meta.env.VITE_API_URL}/admin/updateDesignationOrSummary`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { ...payload },
  };

  return axios(configurations);
};
