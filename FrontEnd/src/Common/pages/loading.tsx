import React from "react";
import LoadingSpinner from "../components/loadingSpinner";

const Loading = React.memo(({ text }: { text: string }) => {
  return (
    <section className="center h-screen dark:bg-neutral-800">
      <div className="flex items-center gap-x-3">
        <LoadingSpinner size="spinner2" />
        <h1 className="text-2xl font-bold max-md:text-lg dark:text-white">
          {text}...
        </h1>
      </div>
    </section>
  );
});

export default Loading;
