import { toast } from "react-toastify";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getHeader = () => {
  const token = localStorage.getItem("token") || "";

  return {
    authorization: `Bearer ${token}`,
  };
};

export default class Http {
  static get(url: string, msg: boolean) {
    return new Promise((resolve, reject) => {
      axios({ method: "GET", url: `${API_URL}/${url}`, headers: getHeader() })
        .then((response) => {
          if (response.data && response.data.success) {
            response.data.message &&
              msg &&
              toast.success(response.data.message);
            resolve(response.data);
          } else {
            toast.success(response.data.message);
            reject(response.data);
          }
        })
        .catch((error) => {
          if (error?.response?.status === 404) {
            toast.error(error?.response?.data?.message);
          } else if (error?.response?.status === 429) {
            toast.error(error?.response?.data?.message);
          } else if (error?.response?.status === 401) {
            localStorage.clear();
            window.location.pathname = "/login";
            toast.error(error?.response?.data?.message);
          } else {
            toast.error(error?.response?.data?.message);
          }
          // if (
          //     error.response.data.message === "Invalid or expired token provided!"
          // ) {
          //     localStorage.clear();
          //     window.location.pathname = "/login";
          // }
          reject(error.response.data);
        });
    });
  }

  static post(url: string, body: unknown, msg: boolean) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${API_URL}/${url}`,
        data: body,
        headers: getHeader(),
      })
        .then((response) => {
          console.log(response);
          if (response.data) {
            response.data.message &&
              msg &&
              toast.success(response?.data?.message);
            resolve(response?.data);
          } else {
            toast.error(response?.data?.message);
            resolve(response?.data);
          }
        })
        .catch((error) => {
          console.log("error 2", error);
          const ApiMsg = error?.response?.data?.message || "";
          ApiMsg && msg && toast.error(ApiMsg);
          if (error?.response?.status === 429) {
            toast.error(error?.response?.data);
          }
          if (url !== "user/login") {
            setTimeout(() => {
              if (error?.response?.status === 401) {
                localStorage.clear();
                window.location.pathname = "/login";
              }
            }, 2000);
          }
          reject(error?.response);
        });
    });
  }
}
