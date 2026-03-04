import { useState, useEffect } from "react";

const useDeviceSize = (size = 900) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    // component is mounted and window is available
    handleWindowResize();
    window.addEventListener("onload", handleWindowResize);
    window.addEventListener("resize", handleWindowResize);
    // unsubscribe from the event on component unmount
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("onload", handleWindowResize);
    };
  }, []);

  return { width, height, isMobile: width === 0 ? false : width <= size };
};

export { useDeviceSize };
