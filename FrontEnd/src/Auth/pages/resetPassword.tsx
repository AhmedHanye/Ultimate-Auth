import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import NavigateHooks from "../../Common/utils/navigateHooks";

import Register from "../components/register";
import RegisterForm from "../components/registerForm";
import InputForm from "../components/inputForm";
import { validateInput } from "../utils/validators";
import { ResetPasswordApi } from "../utils/auth";
import NotifyHooks from "../../Common/utils/notifyHooks";
import SubmitButton from "../components/submitButton";
import OtherRegister from "../components/otherRegister";
import { setLoadingContext } from "../../App";

interface registerData {
  [key: string]: string;
}

const ResetPassword = () => {
  const setLoading = useContext(setLoadingContext) || (() => {});

  const { navigateTo } = NavigateHooks();
  const { NotifySuccess, NotifyError } = NotifyHooks();
  const { uid, token } = useParams(); // * get the uid and token from the url

  const [resetPasswordData, setResetPasswordData] = useState<registerData>({
    password: "",
    retypePassword: "",
  });
  const [errors, setErrors] = useState<registerData>({
    password: "",
    retypePassword: "",
  });

  // * reset password inputs data
  const resetPasswordInputs = useMemo(
    () => [
      {
        value: resetPasswordData.password,
        onChange: (value: string) => {
          setResetPasswordData((prev) => ({
            ...prev,
            password: value,
          }));
          setErrors((prev) => ({
            ...prev,
            password: validateInput("password", value),
          }));
        },
        id: "password",
        autoComplete: "new-password",
        type: "password",
        error: errors.password,
        info: "Enter your new password",
      },
      {
        value: resetPasswordData.retypePassword,
        onChange: (value: string) => {
          setResetPasswordData((prev) => ({
            ...prev,
            retypePassword: value,
          }));
        },
        id: "retypePassword",
        autoComplete: "new-password",
        type: "password",
        error: errors.retypePassword,
        info: "Retype your new password",
      },
    ],
    [resetPasswordData, errors],
  );
  // * check if the password and retype password match
  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      retypePassword:
        resetPasswordData.retypePassword &&
        resetPasswordData.password !== resetPasswordData.retypePassword
          ? "Passwords do not match."
          : "",
    }));
  }, [resetPasswordData.password, resetPasswordData.retypePassword]);

  // * handle reset password
  const handleResetPassword = () => {
    setLoading(true);
    let errorFree = true;
    // * check if all the fields are filled
    Object.keys(resetPasswordData).forEach((key: string) => {
      if (!resetPasswordData[key]) {
        errorFree = false;
        setErrors((prev) => ({
          ...prev,
          [key]: "This field is required.",
        }));
      } else if (errors[key]) {
        errorFree = false;
      }
    });
    // * if all the fields are filled, send the data to the backend
    if (errorFree) {
      ResetPasswordApi({
        new_password: resetPasswordData.password,
        uid: uid,
        token: token,
      })
        .then(() => {
          navigateTo("sign-in");
          NotifySuccess("Password reset successfully");
        })
        .catch((error) => {
          NotifyError(error);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };
  return (
    <Register
      title="Reset Password"
      body={
        <RegisterForm
          formData={
            <>
              {resetPasswordInputs.map((input) => (
                <InputForm
                  key={input.id}
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
                id="resetPassword"
                text="Reset Password"
                color="submit-button3"
                onClick={handleResetPassword}
              />
            </>
          }
        />
      }
      other={
        <OtherRegister
          question="If you remember your password you can"
          registerLink="sign-in"
          register="Sign In"
        />
      }
    />
  );
};

export default ResetPassword;
