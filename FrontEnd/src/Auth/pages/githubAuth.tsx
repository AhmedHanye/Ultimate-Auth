import { useEffect } from "react";
import { GithubSSOApi, setToken } from "../utils/auth";
import Loading from "../../Common/pages/loading";

import NotifyHooks from "../../Common/utils/notifyHooks";
import NavigateHooks from "../../Common/utils/navigateHooks";

const GithubAuth = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code") as string;
  const { navigateTo } = NavigateHooks();
  const { NotifySuccess, NotifyError } = NotifyHooks();

  useEffect(() => {
    // * if the code is not empty, send the code to the backend to get the Tokens
    GithubSSOApi(code)
      .then((response: { access: string; refresh: string }) => {
        setToken("access", response.access, 1);
        setToken("refresh", response.refresh, 1);
        NotifySuccess("Successfully logged in with Github");
        navigateTo("home");
      })
      .catch((error: string) => {
        NotifyError(error);
        navigateTo("sign-in");
      });
  }, []);

  return <Loading text={"Signing In"} />;
};

export default GithubAuth;
