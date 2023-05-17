import { useEffect, useMemo, useState } from "react";

export type typeDimension = {
  width: number;
  height: number;
};

export const Dimension = () => {
  const [dimension, setDimension] = useState<typeDimension>({
    width: 0,
    height: 0,
  });
  useMemo(() => {
    const handleResize = () => {
      setDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimension;
};
