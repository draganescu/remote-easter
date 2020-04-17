import React from "react";
import Egg from "../Egg/Egg";

import "./_style.scss";

export default function Carton({ onEggSelect, activeColor, isForGuests }) {
  let colors = [
    "red",
    "blue",
    "green",
    "cyan",
    "navajowhite",
    "gold",
    "indigo"
  ];
  return (
    <div
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
            onClick={() => onEggSelect(color)}
          />
        );
      })}
    </div>
  );
}
