import axios from "axios";

interface payloadTypes {
  skillId: string;
}

export const deleteSkill = (token: string | null, payload: payloadTypes) => {
  const configurations = {
    method: "post",
    url: `${import.meta.env.VITE_API_URL}/skills/editOrDelete`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { ...payload, active: false },
  };

  return axios(configurations);
};
