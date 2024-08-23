import { Route, Routes } from "react-router-dom";
import React, {
  lazy,
  Suspense,
  useState,
  createContext,
} from "react";

// * Comon Components
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Common/pages/loading";
import OverlayLoading from "./Common/components/overlayLoading";

// * Auth Pages
const SignIn = lazy(() => import("./Auth/pages/signIn"));
const SignUp = lazy(() => import("./Auth/pages/signUp"));
const SignOut = lazy(() => import("./Auth/pages/signOut"));
const Activation = lazy(() => import("./Auth/pages/activation"));
const Activate = lazy(() => import("./Auth/pages/activate"));
const GithubAuth = lazy(() => import("./Auth/pages/githubAuth"));
const ResetingPassword = lazy(() => import("./Auth/pages/resetingPassword"));
const ResetPassword = lazy(() => import("./Auth/pages/resetPassword"));
const DeleteAccount = lazy(() => import("./Auth/pages/deleteAccount"));
const NotFound = lazy(() => import("./Common/pages/notFound"));

// * Core Pages
const Home = lazy(() => import("./Core/pages/home"));

// * Create the context for setLoading
export const setLoadingContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>> | undefined
>(undefined);

const App = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <OverlayLoading />}
      <ToastContainer limit={3} draggable />
      <Suspense fallback={<Loading text="Loading" />}>
        <setLoadingContext.Provider value={setLoading}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/sign-in/" element={<SignIn />} />
            <Route path="/auth/sign-up/" element={<SignUp />} />
            <Route path="/auth/sign-out/:all?" element={<SignOut />} />
            <Route path="/auth/activation/" element={<Activation />} />
            <Route path="/auth/activate/:uid/:token/" element={<Activate />} />
            <Route path="/auth/github-auth/" element={<GithubAuth />} />
            <Route
              path="/auth/reseting-password/"
              element={<ResetingPassword />}
            />
            <Route
              path="/auth/reset-password/:uid/:token/"
              element={<ResetPassword />}
            />
            <Route path="/auth/delete-account/" element={<DeleteAccount />} />

            {/* Core Routes */}
            <Route path="/" element={<Home />} />

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </setLoadingContext.Provider>
      </Suspense>
    </>
  );
};

export default App;
