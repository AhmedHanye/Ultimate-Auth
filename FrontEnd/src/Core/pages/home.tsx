import { useContext, useEffect, useState } from "react";
import NotifyHooks from "../../Common/utils/notifyHooks";
import NavigateHooks from "../../Common/utils/navigateHooks";

import { removeAllTokens, ApiAuth } from "../../Auth/utils/auth";
import { setLoadingContext } from "../../App";

interface userData {
  [key: string]: string;
}

const Home = () => {
  const setLoading = useContext(setLoadingContext) || (() => {});

  const [userData, setUserData] = useState<userData>({});

  const { navigateTo } = NavigateHooks();
  const { NotifyError } = NotifyHooks();

  useEffect(() => {
    setLoading(true);
    ApiAuth(
      "userDetails",
      {},
      "GET"
    )
      .then((res) => {
        setUserData(res);
      })
      .catch((error: string) => {
        if (error === "Token is blacklisted") {
          error =
            "Your session has expired or is invalid. Please log in again.";
        }
        else if (error !== "Network Error") {
          removeAllTokens();
          navigateTo("sign-in");
        }
        NotifyError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="flex flex-col gap-y-5 p-5">
      <h1>Home</h1>
      <p id="user-name">Username: {userData.username}</p>
      <p id="user-email">email: {userData.email}</p>
      <button
        className="rounded-lg bg-red-500 px-5 py-2 font-bold text-white"
        onClick={() => navigateTo("sign-out")}
      >
        Log out
      </button>
      <button
        className="rounded-lg bg-red-500 px-5 py-2 font-bold text-white"
        onClick={() => navigateTo("sign-out-all")}
      >
        Log out All
      </button>
      <button
        className="rounded-lg bg-red-500 px-5 py-2 font-bold text-white"
        onClick={() => navigateTo("delete-account")}
      >
        Delete Account
      </button>
    </main>
  );
};

export default Home;
