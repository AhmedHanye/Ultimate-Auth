import React from "react";

const LoadingSpinner = React.memo(({ size }: { size: string }) => {
  return (
    <div
      className={`animate-spin rounded-full border-gray-300 border-t-blue-600 transition-all duration-150 ${size}`}
    ></div>
  );
});

export default LoadingSpinner;
