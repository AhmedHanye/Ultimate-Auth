import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import sunSvg from "../../assets/images/sun.svg";
import moonSvg from "../../assets/images/moon.svg";
import { PreloadImage } from "../utils/preloadImage";

const ThemeToggle = () => {
  const [themeConfig, setThemeConfig] = useState<string>(""); // * this is in the storage
  const [themeList, setThemeList] = useState<boolean>(false); // * choosen on the list
  const [imagesReady, setImagesReady] = useState<number>(0);

  const themeSystem = useRef<HTMLDivElement>(null); // * Used for referencing the ThemeToggle

  // * wait until images are loaded before showing the theme toggle
  useEffect(() => {
    PreloadImage({ src: sunSvg }).finally(() =>
      setImagesReady((prev) => prev + 1),
    );
    PreloadImage({ src: moonSvg }).finally(() =>
      setImagesReady((prev) => prev + 1),
    );
  }, []);

  // * update themeConfig state whenever component mounts or theme changes in another tab or window
  useEffect(() => {
    setThemeConfig(localStorage.getItem("theme") || "system");
    window.addEventListener("storage", (event) => {
      if (event.key === "theme") {
        setThemeConfig(localStorage.getItem("theme") || "");
      }
    });
    return () => {
      window.removeEventListener("storage", () => {});
    };
  }, []);

  // * close theme list when clicked outside or escap key is pressed
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        themeList &&
        themeSystem.current &&
        !themeSystem.current.contains(event.target as Node)
      ) {
        setThemeList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setThemeList(false);
      }
    });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", () => {});
    };
  }, [themeSystem, themeList]);

  // * handle theme change
  const handleTheme = (theme: string) => {
    localStorage.setItem("theme", theme);
    setThemeConfig(theme); // update themeConfig state
    setThemeList(false);
  };

  // * animation start
  useGSAP(() => {
    if (imagesReady == 2) {
      const T = gsap.timeline();
      T.fromTo(
        "#theme-toggle",
        { y: "-7rem" },
        { y: "0", duration: 1.2, ease: "bounce.out" },
      );
      T.to("#theme-toggle", {
        duration: 5,
        rotate: 360,
        ease: "none",
        repeat: -1,
      });
    }
  }, [imagesReady]);

  return (
    imagesReady == 2 && (
      <div
        onClick={() => setThemeList(!themeList)}
        className="center relative size-full cursor-pointer z-50 text-white"
        ref={themeSystem}
      >
        <div
          className="bg-sun dark:bg-moon size-full rounded-full bg-cover bg-center shadow-sun drop-shadow-lg"
          id="theme-toggle"
        ></div>
        {themeList && (
          <div className="absolute -left-14 top-16 flex flex-col divide-y-2 divide-gray-400 overflow-hidden rounded-md bg-neutral-800 font-bold text-white dark:bg-white dark:text-black">
            {["light", "dark", "system"].map((item) => (
              <div
                key={item}
                onClick={() => handleTheme(item)}
                className={`px-4 py-2 capitalize hover:bg-gray-700 dark:hover:bg-gray-100 ${
                  item === themeConfig ? "text-green-500" : ""
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  );
};

export default ThemeToggle;
