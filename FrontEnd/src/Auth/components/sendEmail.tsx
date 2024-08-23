import React, { useContext, useState } from "react";
import NotifyHooks from "../../Common/utils/notifyHooks";

import EmailMessageImage from "../../assets/images/email_message.svg";
import { validateInput } from "../utils/validators";

import OtherRegister from "./otherRegister";
import SubmitButton from "./submitButton";
import AuthLayout from "./authLayout";

import { setLoadingContext } from "../../App";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
interface sendData {
  [key: string]: string;
}

const SendEmail = React.memo(
  ({
    text,
    func,
    header,
  }: {
    text: String;
    func: (data: sendData) => Promise<sendData>;
    header: string;
  }) => {
    const [email, setEmail] = useState<string>("");
    const setLoading = useContext(setLoadingContext) || (() => {});

    // * Handle sending email to the user
    const handleSendEmail = () => {
      const { NotifySuccess, NotifyError } = NotifyHooks();
      setLoading(true);
      const errMessage = validateInput("email", email);
      // * if the email is valid and not empty, send the email else show an error message
      if (email && !errMessage) {
        func({
          email: email,
        })
          // * if the email message is sent successfully, show a success message
          .then(() => {
            NotifySuccess("Email Sent Successfully");
          })
          // * if the email message is not sent successfully, show an error message
          .catch((error) => {
            NotifyError(error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
        NotifyError(errMessage || "Please Enter Your Email");
      }
    };
    // * Animate the `email-header` by :
    // * email-header: make email-header slide up from 2rem to 0 and gradually increasing in opacity
    useGSAP(() => {
      const T = gsap.timeline();
      T.fromTo(
        "#email-header",
        { y: "2rem", opacity: 0 },
        { y: "0", opacity: 1, duration: 0.4, ease: "none"},
      );
    }, []);
    return (
      <AuthLayout
        page={
          <>
            {/* Email Header */}
            <h1
              className="w-full pt-4 text-center text-2xl font-bold max-lg:pt-20 max-md:text-lg dark:text-white"
              id="email-header"
            >
              {header}
            </h1>
            {/* Email image */}
            <img
              id="email-image"
              src={EmailMessageImage}
              width={600}
              height={600}
              fetchpriority="high"
              loading="eager"
              className="rounded-2xl bg-neutral-800 max-md:w-full max-md:rounded-none"
              alt="activation account image"
            />
            {/* Email Input and submit */}
            <div
              className="center gap-3 max-md:w-11/12 max-md:flex-col"
              id="email-input"
            >
              <input
                type="email"
                id="email-verify"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter Your Email"
                autoComplete="email"
                className="w-[28rem] rounded-lg border-2 px-3 py-1.5 text-lg font-bold shadow-inner drop-shadow-2xl max-md:w-full"
              />
              <div className="w-72">
                <SubmitButton
                  id="send-email"
                  text={text as string}
                  color="submit-button5"
                  onClick={handleSendEmail}
                />
              </div>
            </div>
            {/* Other Register */}
            <div className="mt-5">
              {
                <OtherRegister
                  register="SignIn"
                  registerLink="sign-in"
                  question="If You Don't need this you can go to"
                />
              }
            </div>
          </>
        }
      />
    );
  },
);

export default SendEmail;
