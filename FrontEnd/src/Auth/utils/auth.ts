import axios from "axios";
const backend_url = import.meta.env.VITE_BACKEND_URL as string;

type apiPaths = "signIn" | "refreshToken" | "signOut" | "signUp" | "resendActivationLink" | "activateEmail" | "googleSSO" | "githubSSO" | "userDetails" | "deleteAccount" | "askForPasswordReset" | "resetPassword";

// * API Endpoints
const apiEndPoints: {
  [key: string]: string;
} = {
  signIn: "/api/token/",
  refreshToken: "/api/token/refresh/",
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
  if (method) { // 1 for localStorage and 0 for sessionStorage
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

export const ApiAuth = (
  api: apiPaths,
  data: any,
  method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
): Promise<any> => {
  return new Promise((resolve, reject) => {
    let headers: { Authorization?: string } = {};

    // Check if the API requires an access token
    if (["deleteAccount", "userDetails", "signOut"].includes(api)) {
      const token = getToken("access");
      if (!token) {
        reject("You need to Sign in first");
        return;
      }
      headers = { Authorization: `Bearer ${token}` };
    }

    const config = {
      method,
      url: `${backend_url}${apiEndPoints[api]}`,
      data,
      headers,
    };

    // Make the initial request
    axios(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        // Handle token expiration (401 Unauthorized with specific message)
        if (
          headers.Authorization &&
          error?.response?.status === 401 &&
          error.response?.data?.detail ===
            "Given token not valid for any token type"
        ) {
          // Try to refresh the token
          axios({
            method: "POST",
            url: `${backend_url}${apiEndPoints.refreshToken}`,
            data: { refresh: getToken("refresh") },
          })
            .then((res: any) => {
              const m = localStorage.getItem("refresh") ? 1 : 0;
              setToken("access", res.data.access, m);
              setToken("refresh", res.data.refresh, m);

              // Retry the original request with the new token
              return ApiAuth(api, data, method).then(resolve).catch(reject);
            })
            .catch((refreshError) => {
              // Reject the promise if refreshing the token fails
              reject(handleError(refreshError));
            });
        } else {
          // Reject the promise with the original error
          reject(handleError(error));
        }
      });
  });
};
