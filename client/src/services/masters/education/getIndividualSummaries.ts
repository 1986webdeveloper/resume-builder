import axios from "axios";

export const getIndividualSummaries = (token: string | null, id: string) => {
  const configurations = {
    method: "get",
    url: `${
      import.meta.env.VITE_API_URL
    }/education/getAllEducationDetails?educationId=${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(configurations);
};
