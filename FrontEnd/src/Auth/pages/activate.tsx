import { useParams } from "react-router-dom";
import { useEffect } from "react";
import NavigateHooks from "../../Common/utils/navigateHooks";
import NotifyHooks from "../../Common/utils/notifyHooks";

import { ApiAuth } from "../utils/auth";
import Loading from "../../Common/pages/loading";

const Activate = () => {
  const { uid, token } = useParams();
  const { navigateTo } = NavigateHooks();
  const { NotifySuccess, NotifyError } = NotifyHooks();
  useEffect(() => {
    if (!uid || !token) {
      NotifyError("Invalid activation link.");
      navigateTo("activation");
    } else {
      ApiAuth(
        "activateEmail",
        { 
          uid: uid,
          token: token,
         },
      )
        .then(() => {
          NotifySuccess("Account activated successfully.");
          navigateTo("sign-in");
        })
        .catch((error) => {
          NotifyError(error);
          navigateTo("activation");
        });
    }
  }, []);
  return <Loading text={"Activating"} />;
};

export default Activate;
