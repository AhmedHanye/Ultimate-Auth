import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { getToken, removeAllTokens, ApiAuth } from "../utils/auth";
import Loading from "../../Common/pages/loading";
import NavigateHooks from "../../Common/utils/navigateHooks";
import NotifyHooks from "../../Common/utils/notifyHooks";

const SignOut = () => {
  const { all } = useParams();
  const { navigateTo } = NavigateHooks();
  const { NotifySuccess, NotifyError } = NotifyHooks();

  // * handle sign out
  useEffect(() => {
    // * if the user is signed in
    if (getToken("refresh") !== null) {
      const data = {
        all: all === "all",
        ...(all !== "all" && { refresh: getToken("refresh") }),
      };
      ApiAuth(
        "signOut",
        data
      )
        .then(() => NotifySuccess("Signed Out Successfully"))
        .catch((error: string) => NotifyError(error))
        .finally(() => {
          // * remove all tokens and navigate to sign in page
          removeAllTokens();
          navigateTo("sign-in");
        });
    } else {
      NotifyError("You are already signed out or not signed in.");
      navigateTo("sign-in");
    }
  });
  return <Loading text={"Signing Out"} />;
};

export default SignOut;
