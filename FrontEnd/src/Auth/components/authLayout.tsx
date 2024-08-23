import React, { ReactNode } from "react";
import ThemeToggle from "../../Common/components/themeToggle";

// * Layout for Auth Pages
const AuthLayout = React.memo(({ page }: { page: ReactNode }) => {
  return (
    <section className="dark:bg-neutral-800 relative max-md:dark:bg-neutral-800 overflow-hidden transition-colors duration-200 py-3 center flex-col gap-y-4 min-h-screen">
      {/* Theme Toggle */}
      <div id="register-theme" className="absolute top-6 right-6 size-14">
        <ThemeToggle />
      </div>
      {/* Auth Page */}
      {page}
    </section>
  );
});

export default AuthLayout;
