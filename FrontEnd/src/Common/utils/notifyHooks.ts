import { toast } from "react-toastify";

const NotifyHooks = () => {
  const NotifySuccess = (message: string) => toast.success(message);
  const NotifyError = (message: string) => toast.error(message);

  return { NotifySuccess, NotifyError };
};

export default NotifyHooks;
