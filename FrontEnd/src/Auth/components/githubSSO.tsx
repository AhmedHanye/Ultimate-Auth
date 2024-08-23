import React, { useContext } from "react";
import { setLoadingContext } from "../../App";

import GithubIcon from "../../assets/images/github.svg";
import ButtonSSO from "./buttonSSO";

const GithubSSO = React.memo(() => {
  const setLoading = useContext(setLoadingContext) || (() => {});
  // * Redirects to GitHub OAuth to authenticate user so we can grap the code for the backend
  const redirectToGitHub = () => {
    setLoading(true);
    const client_id = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirect_url = window.location.origin + "/auth/github-auth/";
    const scope = "user:email";

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_url}&scope=${scope}`;
    window.location.href = authUrl;
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <ButtonSSO
      text="Github"
      img={GithubIcon}
      alt="Github SSO"
      func={redirectToGitHub}
    />
  );
});

export default GithubSSO;
