import React, { useEffect, useRef } from "react";

const SubmitButton = React.memo(
  ({
    id,
    text,
    color,
    onClick,
  }: {
    id: string;
    text: string;
    color: string;
    onClick: () => void;
  }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    // * submit the form when the user presses the enter key
    useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter" && buttonRef.current) {
          buttonRef.current.click();
        }
      };
      document.addEventListener("keypress", handleKeyPress);

      return () => {
        document.removeEventListener("keypress", handleKeyPress);
      };
    }, []);
    return (
      <button
        ref={buttonRef}
        id={id}
        type="submit"
        name={id}
        className={`center w-full py-2 ${color} hover-transition1 rounded-lg text-lg font-bold text-white`}
        onClick={onClick}
      >
        {text}
      </button>
    );
  },
);
export default SubmitButton;
