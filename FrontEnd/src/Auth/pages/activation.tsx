import { resendActivationLinkApi } from "../utils/auth";
import SendEmail from "../components/sendEmail";

const Activation = () => {
  return (
    <SendEmail
      header="Open Your Email Account and visite the activation link."
      func={resendActivationLinkApi}
      text="Resend Activation Link"
    />
  );
};

export default Activation;
