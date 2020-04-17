import React from "react";
import "./thestyle.css";
import { Crack } from "../crack";

export function Egg({ isCracked, crack = false, color = "red", onClick }) {
  const gradient =
    "radial-gradient(75.71% 75.71% at 64.89% 75.71%, lightyellow 0%, $color 100%)";
  const background = gradient.replace("$color", color);
  const eggStyle = {
    background
  };

  return (
    <div className="egg" style={eggStyle} onClick={onClick}>
      {isCracked && crack && <Crack />}
    </div>
  );
}
