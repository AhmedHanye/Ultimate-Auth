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

export const ApiAuth =  (
  api:apiPaths,
  data: any,
  method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
): Promise<any> =>  {
  return new Promise((resolve, reject) => {
    /* 
      1. check if the api requires a token
      2. if it does, check if the token is present in the local storage
      3. if it is, add the token to the headers
      4. if not, reject the promise with a message
    */
    let headers = {};
    if (["deleteAccount", "userDetails","signOut"].includes(api)) {
      if (!getToken("access")){
        reject("You need to Sign in first");
        return;
      }
      else{
        headers = { Authorization: `Bearer ${getToken("access")}` };
      }
    }

    // Config for the axios request
    const config = {
      method,
      url: `${backend_url}${apiEndPoints[api]}`,
      data,
      headers,
    };

    // Make the request
    axios(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        // if the error is due to an invalid access token
        if (headers && error?.response?.status === 401 &&
           error.response?.data?.detail === "Given token not valid for any token type") {
            axios({
              method: "POST",
              url: `${backend_url}${apiEndPoints.refreshToken}`,
              data: { refresh: getToken("refresh") },
            }).then((res:any) => {
              const m = localStorage.getItem("refresh") ? 1 : 0;
              setToken("access", res.access, m);
              setToken("refresh", res.refresh, m);

              // Retry the original request with the new token
              return ApiAuth(api, data, method).then(resolve).catch(reject);
            }).catch((refreshError) => {
              reject(handleError(refreshError));
            });
        }
        reject(handleError(error));
      });
  })
}