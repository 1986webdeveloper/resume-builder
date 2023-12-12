import axios from "axios";

interface payloadTypes {
  summaryId: string;
  type: string | undefined;
  designationId: string;
}

export const deleteSingleField = (
  token: string | null,
  payload: payloadTypes
) => {
  const configurations = {
    method: "post",
    url: `${import.meta.env.VITE_API_URL}/admin/updateDesignationOrSummary`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { ...payload, active: false },
  };

  return axios(configurations);
};
