import { Link } from "react-router-dom";
import ThemeToggle from "../components/themeToggle";

const NotFound = () => {
  return (
    <section className="center px-4 hover-transition1 h-screen flex-col bg-white dark:bg-neutral-800">
      <div id="register-theme" className="absolute right-6 top-6 size-14">
        <ThemeToggle />
      </div>
      <h1 className="text-9xl font-bold text-blue-500 max-md:text-7xl">404</h1>
      <h2 className="text-5xl font-bold max-md:text-2xl dark:text-white">
        Something's missing.
      </h2>
      <p className="mt-5 text-center text-xl font-semibold text-gray-700 max-md:text-sm dark:text-gray-300">
        Sorry, we can't find that page. You'll find lots to explore on the home
        page.
      </p>
      <Link
        to="/"
        className="submit-button1 hover-transition1 mt-8 rounded-lg px-8 py-2 text-lg font-bold text-white max-md:text-base"
      >
        Back to Home
      </Link>
    </section>
  );
};

export default NotFound;
