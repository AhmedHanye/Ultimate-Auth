import SendEmail from "../components/sendEmail";

const Activation = () => {
  return (
    <SendEmail
      header="Open Your Email Account and visite the activation link."
      api="resendActivation"
      text="Resend Activation Link"
    />
  );
};

export default Activation;
