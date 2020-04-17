import React from "react";
import { Egg } from "../egg";
import "./thestyle.css";

function eggRow(onEggSelect) {
  let eggRow = [];
  let colors = [
    "red",
    "blue",
    "green",
    "cyan",
    "navajowhite",
    "gold",
    "indigo"
  ];
  for (let eggs = 0; eggs < colors.length; eggs++) {
    eggRow.push(
      <Egg
        key={eggs}
        color={colors[eggs]}
        onClick={() => onEggSelect(colors[eggs])}
      />
    );
  }
  return eggRow;
}

export function Carton({ onEggSelect }) {
  return <div className="carton">{eggRow(onEggSelect)}</div>;
}
