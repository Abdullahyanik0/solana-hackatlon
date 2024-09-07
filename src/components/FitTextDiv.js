import React, { useEffect, useRef } from "react";

const FitTextDiv = ({ children, style }) => {
  const divRef = useRef(null);

  useEffect(() => {
    const resizeContents = () => {
      const div = divRef.current;
      if (div && div.innerText !== "") {
        let divWidth = div.clientWidth;
        let divHeight = div.clientHeight;

        let contentWidth = div.scrollWidth;
        let contentHeight = div.scrollHeight;

        let fontSize = parseFloat(window.getComputedStyle(div, null).getPropertyValue("font-size"));

        while (contentWidth <= divWidth && contentHeight <= divHeight) {
          fontSize += 1;
          div.style.fontSize = fontSize + "px";
          contentWidth = div.scrollWidth;
          contentHeight = div.scrollHeight;
        }

        while (contentWidth > divWidth || contentHeight > divHeight) {
          fontSize -= 1;
          div.style.fontSize = fontSize + "px";
          contentWidth = div.scrollWidth;
          contentHeight = div.scrollHeight;
        }
      }
    };

    resizeContents();
  }, [children]);

  return (
    <div
      ref={divRef}
      className="text-fit resizable flex justify-center items-center"
      style={{
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default FitTextDiv;
