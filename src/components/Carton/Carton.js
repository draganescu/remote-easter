import React from "react";
import Egg from "../Egg/Egg";

import "./_style.scss";

export default function Carton({ onEggSelect, activeColor, isForGuests, scrollPosition = 0 }) {
  let colors = [
    "red",
    "blue",
    "green",
    "cyan",
    "navajowhite",
    "gold",
    "indigo"
  ];

  // In order to keep the selected egg by the opponent always in view
  const wrapperRef = React.useRef(null);
  React.useEffect(() => {
    wrapperRef.current.scrollLeft = scrollPosition
  }, [scrollPosition])

  return (
    <div
      ref={wrapperRef}
      className={`carton ${
        isForGuests && !activeColor ? "is-not-selected" : "is-selected"
      } ${isForGuests ? "is-for-guests" : "is-for-hosts"}`}
    >
      {colors.map(color => {
        return (
          <Egg
            key={color}
            active={activeColor === color}
            color={color}
            onClick={() => onEggSelect(color, wrapperRef.current.scrollLeft)}
          />
        );
      })}
    </div>
  );
}
