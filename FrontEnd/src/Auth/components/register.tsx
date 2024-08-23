import React, { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import AuthLayout from "./authLayout";

import NavigateHooks from "../../Common/utils/navigateHooks";
import { getToken } from "../utils/auth";

import AuthLogo from "../../assets/images/auth_logo.svg";

const Register = React.memo(
  ({
    body,
    title,
    other,
  }: {
    body: ReactNode;
    title: string;
    other?: ReactNode;
  }) => {
    // * Animate the `register-heading` by :
    // * h1: make h1 slide up from 2rem to 0 and gradually increasing in opacity
    useGSAP(() => {
      const T = gsap.timeline();
      T.fromTo(
        "#register-heading > h1",
        { y: "2rem", opacity: 0 },
        { y: "0", opacity: 1, duration: 0.4, ease: "none" },
        "0",
      );
    }, []);

    const location = useLocation();
    const { navigateTo } = NavigateHooks();

    useEffect(() => {
      // * Redirect to home if the user is already authenticated
      const registerPaths = ["/auth/sign-in", "/auth/sign-up"];
      const isRegisterPaths = registerPaths.some((path) =>
        location.pathname.startsWith(path),
      );
      if (isRegisterPaths && getToken("access")) {
        navigateTo("home");
      }
    }, [location]);

    return (
      <AuthLayout
        page={
          <>
            {/* Register Heading */}
            <div id="register-heading" className="center flex-col gap-2">
              <img
                src={AuthLogo}
                width={150}
                height={150}
                fetchpriority="high"
                loading="eager"
                alt="Auth Logo"
              />
              <h1 className="text-2xl font-bold max-md:text-xl dark:text-white">
                {title}
              </h1>
            </div>
            {/* Register Body */}
            {body}
            {/* Other Register */}
            {other}
          </>
        }
      />
    );
  },
);

export default Register;
