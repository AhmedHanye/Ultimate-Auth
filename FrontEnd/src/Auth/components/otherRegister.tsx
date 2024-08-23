import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React from "react";

const OtherRegister = React.memo(
  ({
    register,
    registerLink,
    question,
  }: {
    register: string;
    registerLink: string;
    question: string;
  }) => {
    // * Animate `other-register` to slide down from the top while gradually increasing in opacity.
    useGSAP(() => {
      const T = gsap.timeline();
      T.fromTo(
        "#other-register",
        { opacity: 0, y: "-1rem" },
        { y: "0", opacity: 1, duration: 0.4, ease: "none" },
      );
    }, []);
    return (
      <div id="other-register">
        {/* Question */}
        <span className="pe-2 dark:text-white">{question}</span>
        {/* Register Link */}
        <Link
          to={`/auth/${registerLink}`}
          className="hover-transition1 font-bold text-indigo-700 hover:text-indigo-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {register}
        </Link>
      </div>
    );
  },
);

export default OtherRegister;
