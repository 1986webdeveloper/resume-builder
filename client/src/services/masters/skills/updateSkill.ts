import axios from "axios";

interface payloadTypes {
  skillId: string;
  name: string;
}

export const updateSkill = (token: string | null, payload: payloadTypes) => {
  const configurations = {
    method: "post",
    url: `${import.meta.env.VITE_API_URL}/skills/editOrDelete`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { ...payload },
  };

  return axios(configurations);
};
