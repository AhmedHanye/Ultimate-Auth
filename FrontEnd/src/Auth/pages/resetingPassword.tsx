import SendEmail from "../components/sendEmail";
import { AskForPasswordResetApi } from "../utils/auth";

const ResetingPassword = () => {
  return (
    <SendEmail
      header="Open Your Email Account and visite the reseting password link."
      func={AskForPasswordResetApi}
      text="Send Reset Password Link"
    />
  );
};

export default ResetingPassword;
