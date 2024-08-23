import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleSSO from "./googleSSO";
import GithubSSO from "./githubSSO";
import React from "react";

const OtherMethods = React.memo(() => {
  return (
    <div id="other-methods" className="flex w-full flex-col gap-6">
      {/* Divider */}
      <div className="flex items-center gap-3">
        <span className="h-0.5 w-full bg-gray-300"></span>
        <h2 className="text-nowrap max-md:dark:text-white">Or continue with</h2>
        <span className="h-0.5 w-full bg-gray-300"></span>
      </div>
      {/* SSO */}
      <div className="flex gap-x-5 max-md:dark:text-white">
        {/* Google SSO */}
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleSSO />
        </GoogleOAuthProvider>
        {/* Github SSO */}
        <GithubSSO />
      </div>
    </div>
  );
});

export default OtherMethods;
