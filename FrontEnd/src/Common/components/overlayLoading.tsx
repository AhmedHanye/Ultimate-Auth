import LoadingSpinner from "./loadingSpinner";

const OverlayLoading = () => {
  return (
    <div
      id="overlayLoading"
      className="center fixed top-0 z-50 h-screen w-screen bg-white bg-opacity-15"
    >
      <LoadingSpinner size="spinner1" />
    </div>
  );
};

export default OverlayLoading;
