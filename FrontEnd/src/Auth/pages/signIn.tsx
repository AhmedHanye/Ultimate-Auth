import { useState, useRef, useMemo, useContext } from "react";
import { Link } from "react-router-dom";

import Register from "../components/register";
import InputForm from "../components/inputForm";
import RegisterForm from "../components/registerForm";
import OtherMethods from "../components/otherMethods";
import OtherRegister from "../components/otherRegister";
import SubmitButton from "../components/submitButton";

import NavigateHooks from "../../Common/utils/navigateHooks";
import NotifyHooks from "../../Common/utils/notifyHooks";
import { setToken,ApiAuth } from "../utils/auth";
import { validateInput } from "../utils/validators";
import { setLoadingContext } from "../../App";

interface registerData {
  [key: string]: string;
}

const SignIn = () => {
  const setLoading = useContext(setLoadingContext) || (() => {});
  const { NotifySuccess, NotifyError } = NotifyHooks();
  const { navigateTo } = NavigateHooks();

  const rememberMe = useRef<HTMLInputElement>(null);
  const [signInData, setSignInData] = useState<registerData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<registerData>({});

  // * handle change in the input fields
  const handleChange = (id: string, value: string) => {
    setSignInData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: validateInput(id, value),
    }));
  };
  // * sign in inputs data
  const signInInputs = useMemo(
    () => [
      {
        value: signInData.email,
        onChange: (value: string) => handleChange("email", value),
        id: "email",
        autoComplete: "email",
        type: "email",
        error: errors.email,
        info: "Enter your email address",
      },
      {
        value: signInData.password,
        onChange: (value: string) => handleChange("password", value),
        id: "password",
        autoComplete: "current-password",
        type: "password",
        error: errors.password,
        info: "Enter your password assigned to the email",
      },
    ],
    [signInData.email, signInData.password, errors.email, errors.password],
  );
  // * handle sign in
  const handleSignIn = () => {
    setLoading(true);
    let errorFree = true;
    // * check if the input fields are valid
    Object.keys(signInData).forEach((key: string) => {
      if (!signInData[key]) {
        errorFree = false;
        setErrors((prev) => ({
          ...prev,
          [key]: "This field is required.",
        }));
      } else if (errors[key]) {
        errorFree = false;
      }
    });
    // * if the input fields are valid, send the data to the backend
    if (errorFree) {
      ApiAuth(
        "signIn",
        {
          email: signInData.email,
          password: signInData.password,
        }
      )
        .then((res: { access: string; refresh: string }) => {
          const m = rememberMe.current?.checked ? 1 : 0; // * 1 -> local, 0 -> session storage
          setToken("access", res.access || "", m);
          setToken("refresh", res.refresh || "", m);
          NotifySuccess("Successfully signed in");
          navigateTo("home");
        })
        .catch((err: string) => {
          NotifyError(err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  return (
    <Register
      title="Sign In to your account"
      body={
        <RegisterForm
          formData={
            <>
              {signInInputs.map((input, index) => (
                <InputForm
                  key={index}
                  value={input.value}
                  onChange={input.onChange}
                  id={input.id}
                  autoComplete={input.autoComplete}
                  type={input.type}
                  error={input.error}
                  info={input.info}
                />
              ))}
              <div className="mt-2 flex w-full items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <input
                    ref={rememberMe}
                    type="checkbox"
                    id="remember-me"
                    className="h-4 w-4 cursor-pointer accent-indigo-500 max-md:dark:text-white"
                  />
                  <label
                    htmlFor="remember-me"
                    className="cursor-pointer max-md:dark:text-white"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/auth/reseting-password/"
                  className="hover-transition1 font-bold text-blue-700 hover:text-blue-500 max-md:dark:text-blue-400 max-md:dark:hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>
              <SubmitButton
                id="sign-in"
                text="Sign In"
                color="submit-button1"
                onClick={handleSignIn}
              />
              <OtherMethods />
            </>
          }
        />
      }
      other={
        <OtherRegister
          register="SignUp"
          registerLink="sign-up"
          question="Don't have an account?"
        />
      }
    />
  );
};

export default SignIn;
