import { useContext, useState } from "react";
import Register from "../components/register";
import SubmitButton from "../components/submitButton";
import InputForm from "../components/inputForm";
import RegisterForm from "../components/registerForm";
import { validateInput } from "../utils/validators";
import { ApiAuth, removeAllTokens } from "../utils/auth";
import NavigateHooks from "../../Common/utils/navigateHooks";
import NotifyHooks from "../../Common/utils/notifyHooks";
import { setLoadingContext } from "../../App";

const DeleteAccount = () => {
  const setLoading = useContext(setLoadingContext) || (() => {});

  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { navigateTo } = NavigateHooks();
  const { NotifySuccess, NotifyError } = NotifyHooks();

  // * handle deleting the account
  const handleDeleteAccount = () => {
    setLoading(true);
    // * if the password is not empty, delete the account else show an error message
    if (password.trim()) {
      ApiAuth("deleteAccount",{
        current_password: password.trim(),
      },
    "DELETE")
        // * if the account is deleted successfully, show a success message
        .then(() => {
          NotifySuccess("Account Deleted Successfully");
          removeAllTokens();
          navigateTo("sign-in");
        })
        // * if the account is not deleted successfully, show an error message
        .catch((error) => {
          NotifyError(error);
          if (error === "Authentication credentials were not provided.") {
            navigateTo("sign-in");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setError("Password is required");
      setLoading(false);
    }
  };
  return (
    <Register
      title="Delete Account"
      body={
        <RegisterForm
          formData={
            <>
              <InputForm
                id="current password"
                value={password}
                onChange={(value: string) => {
                  setPassword(value);
                  setError(validateInput("password", value));
                }}
                autoComplete="new-password"
                error={error}
                type="password"
                info="Enter your current password to delete your account"
              />
              <SubmitButton
                id="deleteAccount"
                text="Delete Account"
                color="submit-button4"
                onClick={handleDeleteAccount}
              />
            </>
          }
        />
      }
    />
  );
};

export default DeleteAccount;
