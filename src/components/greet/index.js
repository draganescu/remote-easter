import React from "react";
import "./thestyle.css";

function Act({ text, onClick }) {
  return (
    <button className={"btn btn-lg btn-red"} onClick={onClick}>
      {text}
    </button>
  );
}

export function Greet({ onClick, isCreator }) {
  const options = ["Cristos a inviat", "Adevarat a inviat"];
  let startActionText = options[0];

  if (!isCreator) {
    startActionText = options[1];
  }

  return <Act text={startActionText} onClick={() => onClick(true)} />;
}
