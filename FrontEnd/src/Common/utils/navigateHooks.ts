import { useNavigate } from "react-router-dom";
import { setLoadingContext } from "../../App";
import { useContext } from "react";

type navigatePaths = "sign-in" | "sign-up" | "sign-out" | "sign-out-all" | "activation" | "delete-account" | "home";

const NavigateHooks = () => {
  const setLoading = useContext(setLoadingContext) || (() => {});
  const navigate = useNavigate();
  const naviagitionPaths: {
    [key: string]: string;
  } = {
    "sign-in": "/auth/sign-in",
    "sign-up": "/auth/sign-up",
    "sign-out": "/auth/sign-out",
    "sign-out-all": "/auth/sign-out/all",
    activation: "/auth/activation",
    "delete-account": "/auth/delete-account",
    "home": "/",
  };
  const navigateTo = (path: navigatePaths) => {
    navigate(naviagitionPaths[path],
      {
        replace: (path in ["home", "sign-out", "sign-out-all"] ? true : false),
      }
    )
    setLoading(false);
  };
  return {
    navigateTo,
  };
};

export default NavigateHooks;
