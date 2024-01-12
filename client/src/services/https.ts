import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

// Create an instance of axios with default configurations
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000, // Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Define a custom type for the response data
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// Define a custom error type
interface ApiError {
  response: AxiosResponse;
}

// Define your HTTP service methods
export const httpService = {
  get: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await http.get<T>(url, addAuthorizationHeader(config));
      return handleResponse(response);
    } catch (error: any) {
      throw handleRequestError(error);
    }
  },

  post: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await http.post<T>(
        url,
        data,
        addAuthorizationHeader(config)
      );
      return handleResponse(response);
    } catch (error: any) {
      throw handleRequestError(error);
    }
  },
};

// Add the authorization header to the request config if a token is provided
const addAuthorizationHeader = (
  config?: AxiosRequestConfig
): AxiosRequestConfig => {
  const token = localStorage.getItem("token");

  if (token) {
    return {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return config || {};
};

// Handle the response, including checking for a 401 status and redirecting to the login page
const handleResponse = <T>(response: AxiosResponse<T>): ApiResponse<T> => {
  if (response.status === 401) {
    redirectToLoginPage();
  }

  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
  };
};

// Redirect to the login page
const redirectToLoginPage = () => {
  localStorage.clear();
  window.location.pathname = "/login";
};

// Handle Axios errors and format them into a consistent structure
const handleRequestError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      redirectToLoginPage();
    }
    return {
      response: error.response?.data?.error,
    };
  } else {
    throw error;
  }
};
