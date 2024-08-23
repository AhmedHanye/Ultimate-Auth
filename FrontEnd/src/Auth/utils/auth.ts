import axios from "axios";
const backend_url = import.meta.env.VITE_BACKEND_URL as string;

interface AuthData {
  [key: string]: any;
}

// * API Endpoints
const apiEndPoints = {
  signIn: "/api/token/",
  refreshToken: "/api/token/refresh/",
  verifyToken: "/api/token/verify/",
  signOut: "/api/token/logout/",
  signUp: "/auth/users/",
  resendActivationLink: "/auth/users/resend_activation/",
  activateEmail: "/auth/users/activation/",
  googleSSO: "/auth/google/",
  githubSSO: "/auth/github/",
  userDetails: "/auth/users/me/",
  deleteAccount: "/auth/users/me/",
  askForPasswordReset: "/auth/users/reset_password/",
  resetPassword: "/auth/users/reset_password_confirm/",
};

// * API Handler and Error Handler
const handleError = (error: any): string => {
  let finallError: string = "";
  if (typeof error === "string") {
    finallError = error;
  } else {
    const responseData = error?.response?.data;
    if (responseData) {
      if (responseData.detail) return responseData.detail;
      if (Array.isArray(responseData) && responseData.length > 0)
        return responseData[0];
      if (responseData.error) return responseData.error;
      const firstKey = Object.keys(responseData)[0];
      if (firstKey) return `${firstKey}: ${responseData[firstKey]}`;
    } else {
      finallError = error.message || "Something went wrong";
    }
  }

  return finallError;
};

const ApiAuthHandler = async (
  api: string,
  data: any,
  token?: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
  params?: any,
  hasRefreshedToken: boolean = false // Flag to prevent infinite loop
): Promise<any> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const config = {
    method,
    url: `${backend_url}${api}`,
    data,
    params,
    headers,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    // Check if the error is due to an invalid token and if we haven't already refreshed the token
    if (
      apiEndPoints.refreshToken !== api &&
      error?.response?.status === 401 &&
      error.response?.data?.detail ===
        "Given token not valid for any token type" &&
      !hasRefreshedToken
    ) {
      try {
        const res = await refreshTokenApi();
        const m = localStorage.getItem("access") ? 1 : 0;
        setToken("access", res.access, m);
        setToken("refresh", res.refresh, m);

        // Retry the original request with the new token, setting hasRefreshedToken to true
        return ApiAuthHandler(api, data, res.access, method, params, true);
      } catch (refreshError) {
        throw handleError(refreshError);
      }
    } else {
      throw handleError(error);
    }
  }
};

// * Token Management
export const getToken = (token: "access" | "refresh") => {
  return (
    (localStorage.getItem(token) as string) ||
    (sessionStorage.getItem(token) as string) ||
    ""
  );
};
export const setToken = (
  token: "access" | "refresh",
  value: string,
  method: 0 | 1
): void => {
  if (method) {
    localStorage.setItem(token, value);
    sessionStorage.removeItem(token);
  } else {
    sessionStorage.setItem(token, value);
    localStorage.removeItem(token);
  }
};
export const removeAllTokens = (): void => {
  ["access", "refresh"].forEach((token) => {
    localStorage.removeItem(token);
    sessionStorage.removeItem(token);
  });
};

// * Auth APIs Calls
export const signInApi = (data: AuthData): Promise<any> => {
  return ApiAuthHandler(apiEndPoints.signIn, data);
};

export const signUpApi = (data: AuthData): Promise<any> => {
  return ApiAuthHandler(apiEndPoints.signUp, data);
};

export const signOutApi = (data: AuthData): Promise<any> => {
  return ApiAuthHandler(apiEndPoints.signOut, data, getToken("access"));
};

export const refreshTokenApi = (): Promise<any> => {
  if (getToken("refresh")) {
    return ApiAuthHandler(apiEndPoints.refreshToken, {
      refresh: getToken("refresh"),
    });
  }
  return Promise.reject("You need to Sign in first");
};

export const verifyTokenApi = (): Promise<any> => {
  if (!getToken("refresh")) {
    return Promise.reject("No refresh token found");
  } else {
    return ApiAuthHandler(apiEndPoints.verifyToken, {
      token: getToken("access"),
    });
  }
};

export const resendActivationLinkApi = (data: AuthData): Promise<any> => {
  return ApiAuthHandler(apiEndPoints.resendActivationLink, data);
};

export const activateAccountApi = (
  uid: string,
  token: string
): Promise<any> => {
  return ApiAuthHandler(apiEndPoints.activateEmail, { uid, token });
};

export const GoogleSSOApi = (accessToken: string) => {
  return ApiAuthHandler(apiEndPoints.googleSSO, { access_token: accessToken });
};

export const GithubSSOApi = (code: string) => {
  return ApiAuthHandler(apiEndPoints.githubSSO, {
    code: code,
  });
};

export const UserDetailsApi = () => {
  if (!getToken("access")) {
    return Promise.reject("You need to Sign in first");
  } else {
    return ApiAuthHandler(
      apiEndPoints.userDetails,
      {},
      getToken("access"),
      "GET"
    );
  }
};

export const AskForPasswordResetApi = (data: AuthData) => {
  return ApiAuthHandler(apiEndPoints.askForPasswordReset, data);
};

export const ResetPasswordApi = (data: AuthData) => {
  return ApiAuthHandler(apiEndPoints.resetPassword, data);
};

export const DeleteAccountApi = (data: AuthData) => {
  return ApiAuthHandler(
    apiEndPoints.deleteAccount,
    data,
    getToken("access"),
    "DELETE"
  );
};
