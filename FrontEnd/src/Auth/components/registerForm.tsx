import React, { ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const RegisterForm = React.memo(({ formData }: { formData: ReactNode }) => {
  // * Animate the `register-form` by gradually increasing in opacity
  useGSAP(() => {
    const T = gsap.timeline();
    T.fromTo("#register-form", { opacity: 0 }, { opacity: 1, duration: 0.5 });
  }, []);
  return (
    <form
      id="register-form"
      onSubmit={(e) => e.preventDefault()}
      className="center w-[32rem] flex-col gap-3 rounded-xl bg-white px-8 py-6 shadow-form max-md:h-full max-md:w-full max-md:rounded-none max-md:px-5 max-md:shadow-none md:drop-shadow-2xl max-md:dark:bg-neutral-800"
    >
      {formData}
    </form>
  );
});

export default RegisterForm;
