import React from "react";
import "./_style.scss";
import Crack from "./Crack/Crack";

export default function Egg({
  isCracked,
  crack,
  color = "red",
  onClick,
  active
}) {
  const gradient =
    "radial-gradient(75.71% 75.71% at 64.89% 75.71%, lightyellow 0%, $color 100%)";
  const background = gradient.replace("$color", color);
  const eggStyle = {
    background
  };

  return (
    <div
      className={`egg ${active ? "is-active" : "is-idle"}`}
      style={eggStyle}
      onClick={onClick}
    >
      {isCracked && crack && <Crack />}
    </div>
  );
}
