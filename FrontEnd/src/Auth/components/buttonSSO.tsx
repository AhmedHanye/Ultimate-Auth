import React from "react";

const ButtonSSO = React.memo(
  ({
    func,
    img,
    alt,
    text,
  }: {
    func: () => void;
    img: string;
    alt: string;
    text: string;
  }) => {
    return (
      <button
        className="hover-transition1 center w-full gap-4 rounded-lg border-2 border-gray-300 py-2 text-lg font-semibold hover:bg-gray-100 max-md:hover:bg-neutral-700"
        onClick={func}
      >
        <img src={img} width={25} height={25} alt={alt} />
        {text}
      </button>
    );
  },
);

export default ButtonSSO;
