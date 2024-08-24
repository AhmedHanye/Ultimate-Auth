import { useGoogleLogin } from "@react-oauth/google";
import GoogleImage from "../../assets/images/google.svg";
import { ApiAuth, setToken } from "../utils/auth";
import ButtonSSO from "./buttonSSO";

import NotifyHooks from "../../Common/utils/notifyHooks";
import NavigateHooks from "../../Common/utils/navigateHooks";

import { setLoadingContext } from "../../App";
import React, { useContext } from "react";

const GoogleSSO = React.memo(() => {
  const setLoading = useContext(setLoadingContext) || (() => {});

  const { navigateTo } = NavigateHooks();
  const { NotifySuccess, NotifyError } = NotifyHooks();

  // * Login with google SSO and get the access token
  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => handleLogin(codeResponse),
    onError: (error: any) => {
      NotifyError(error as string);
      setLoading(false);
    },
    onNonOAuthError: () => setLoading(false),
  });
  // * verify the access token and create the account then login and get the tokens
  const handleLogin = (user: { access_token: string }) => {
    ApiAuth(
      "googleSSO",
      { access_token: user.access_token },
    )
      .then((response) => {
        setToken("access", response.access, 1);
        setToken("refresh", response.refresh, 1);
        NotifySuccess("Successfully logged in with Google");
        navigateTo("home");
      })
      .catch((error) => NotifyError(error))
      .finally(() => setLoading(false));
  };

  return (
    <ButtonSSO
      text="Google"
      img={GoogleImage}
      alt="Google SSO"
      func={() => {
        setLoading(true);
        login();
      }}
    />
  );
});

export default GoogleSSO;
