import { useState, useEffect } from "react";

const useDebounce = (value) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const delay = 500;
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);
  return [debouncedValue];
};
export default useDebounce;
