import { Tooltip } from "react-tooltip";
import infoIcon from "../../assets/images/info.svg";
import React from "react";

const InputForm = React.memo(
  ({
    value,
    onChange,
    id,
    type,
    autoComplete,
    info,
    error,
  }: {
    value: string;
    onChange: (value: string) => void;
    id: string;
    type: string;
    autoComplete: string;
    info: string;
    error?: string;
  }) => {
    return (
      <div className="relative mb-3 w-full">
        {/* Label */}
        <label
          htmlFor={id}
          className="flex items-center gap-x-2 text-base font-semibold capitalize max-md:dark:text-white"
        >
          {id}
          {/* Info Icon */}
          <img
            src={infoIcon}
            width={15}
            height={15}
            className="cursor-pointer"
            data-tooltip-id="input-info"
            data-tooltip-content={info}
            data-tooltip-place="top"
            alt="info icon"
          />
          <Tooltip
            id="input-info"
            style={{
              backgroundColor: "#00bbf5",
            }}
          />
        </label>
        {/* Form Input */}
        <input
          type={type}
          value={value}
          name={id}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          id={id}
          className="mt-1 w-full rounded-md border-2 border-gray-300 p-0.5 px-1 font-bold outline-blue-500 disabled:bg-gray-200"
        />
        {/* Error Message */}
        <p
          className="absolute -bottom-6 left-0 w-full truncate text-sm font-semibold text-red-600 max-md:text-red-300"
          style={error ? { display: "block" } : { display: "none" }}
          title={error}
        >
          {error}
        </p>
      </div>
    );
  },
);

export default InputForm;
