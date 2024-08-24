import { useEffect } from "react";
import { ApiAuth, setToken } from "../utils/auth";
import Loading from "../../Common/pages/loading";

import NotifyHooks from "../../Common/utils/notifyHooks";
import NavigateHooks from "../../Common/utils/navigateHooks";

const GithubAuth = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code") as string;
  const { navigateTo } = NavigateHooks();
  const { NotifySuccess, NotifyError } = NotifyHooks();

  // * Handle Github Authentication
  useEffect(() => {
    // if code is not present in the url, show an error message and go to the resend email page
    if (!code) {
      NotifyError("Invalid Github Authentication Link");
      navigateTo("activation");
    }
    ApiAuth(
      "githubSSO",
      {
        code: code,
      }
    )
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
