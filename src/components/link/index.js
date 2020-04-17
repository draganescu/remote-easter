import React from "react";
import "./thestyle.css";

const Clipboard = (function(window, document, navigator) {
  var textArea, copy;

  function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }

  function createTextArea(text) {
    textArea = document.createElement("textArea");
    textArea.value = text;
    document.body.appendChild(textArea);
  }

  function selectText() {
    var range, selection;

    if (isOS()) {
      range = document.createRange();
      range.selectNodeContents(textArea);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }
  }

  function copyToClipboard() {
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }

  copy = function(text) {
    createTextArea(text);
    selectText();
    copyToClipboard();
  };

  return {
    copy: copy
  };
})(window, document, navigator);

async function setClipboardText(onClick) {
  await onClick();
  console.log("location: " + window.location);
  Clipboard.copy(window.location);
}

export function Link({ onClick }) {
  return (
    <button
      className={"btn btn-lg btn-green"}
      onClick={() => {
        setClipboardText(onClick);
      }}
    >
      {"Copiaza link"}
    </button>
  );
}
