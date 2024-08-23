import { useContext, useEffect, useMemo, useState } from "react";

import InputForm from "../components/inputForm";
import Register from "../components/register";
import RegisterForm from "../components/registerForm";
import OtherMethods from "../components/otherMethods";
import OtherRegister from "../components/otherRegister";
import { signUpApi } from "../utils/auth";
import { validateInput } from "../utils/validators";
import NavigateHooks from "../../Common/utils/navigateHooks";
import NotifyHooks from "../../Common/utils/notifyHooks";
import SubmitButton from "../components/submitButton";
import { setLoadingContext } from "../../App";

interface registerData {
  [key: string]: string;
}

const SignUp = () => {
  const setLoading = useContext(setLoadingContext) || (() => {});

  const { navigateTo } = NavigateHooks();
  const { NotifySuccess, NotifyError } = NotifyHooks();

  const [signUpData, setSignUpData] = useState<registerData>({
    email: "",
    username: "",
    password: "",
    retypePassword: "",
  });
  const [errors, setErrors] = useState<registerData>({});

  // * Handle Change in Input
  const handleChange = (id: string, value: string) => {
    setSignUpData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: validateInput(id, value),
    }));
  };

  // * Sign Up Inputs
  const signUpInputs = useMemo(
    () => [
      {
        value: signUpData.email,
        onChange: (value: string) => handleChange("email", value),
        id: "email",
        autoComplete: "email",
        type: "email",
        error: errors.email,
        info: "Enter your new email address",
      },
      {
        value: signUpData.username,
        onChange: (value: string) => handleChange("username", value),
        id: "username",
        autoComplete: "username",
        type: "text",
        error: errors.username,
        info: "Enter your new username",
      },
      {
        value: signUpData.password,
        onChange: (value: string) => handleChange("password", value),
        id: "password",
        autoComplete: "new-password",
        type: "password",
        error: errors.password,
        info: "Enter your new password",
      },
      {
        value: signUpData.retypePassword,
        onChange: (value: string) =>
          setSignUpData((prev) => ({ ...prev, retypePassword: value })),
        id: "retype-password",
        autoComplete: "new-password",
        type: "password",
        error: errors.retypePassword,
        info: "Retype your new password",
      },
    ],
    [signUpData, errors, handleChange],
  );

  // * Check Password and Retype Password match
  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      retypePassword:
        signUpData.retypePassword &&
        signUpData.password !== signUpData.retypePassword
          ? "Passwords do not match."
          : "",
    }));
  }, [signUpData.password, signUpData.retypePassword]);

  // * Sign Up Handler
  const handleSignUp = () => {
    setLoading(true);
    let errorFree = true;
    // * Check if all fields are filled and there are no errors
    Object.keys(signUpData).forEach((key: string) => {
      if (!signUpData[key]) {
        errorFree = false;
        setErrors((prev) => ({
          ...prev,
          [key]: "This field is required.",
        }));
      } else if (errors[key]) {
        errorFree = false;
      }
    });
    // * If there are no errors, sign up
    if (errorFree) {
      signUpApi(signUpData)
        .then(() => {
          NotifySuccess("Account Created Successfully");
          navigateTo("activation");
        })
        .catch((err) => {
          NotifyError(err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };
  return (
    <Register
      title="Create an account"
      body={
        <RegisterForm
          formData={
            <>
              {signUpInputs.map((input, index) => (
                <InputForm
                  key={index}
                  value={input.value}
                  onChange={input.onChange}
                  id={input.id}
                  autoComplete={input.autoComplete}
                  type={input.type}
                  info={input.info}
                  error={input.error}
                />
              ))}
              <SubmitButton
                id="sign-up"
                text="Sign Up"
                color="submit-button2"
                onClick={handleSignUp}
              />
              <OtherMethods />
            </>
          }
        />
      }
      other={
        <OtherRegister
          question="Already have an account?"
          registerLink="sign-in"
          register="Sign In"
        />
      }
    />
  );
};

export default SignUp;
