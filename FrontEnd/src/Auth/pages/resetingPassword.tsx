import SendEmail from "../components/sendEmail";

const ResetingPassword = () => {
  return (
    <SendEmail
      header="Open Your Email Account and visite the reseting password link."
      api={"askForPasswordReset"}
      text="Send Reset Password Link"
    />
  );
};

export default ResetingPassword;
