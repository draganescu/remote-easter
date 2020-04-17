import React from "react";
import { useSpring, animated } from "react-spring";

export default function Smash({ children, showCrack }) {
  const props = [
    useSpring({
      position: "relative",
      transform: "rotate( 180deg )",
      top: 11,
      from: { top: -180 },
      onRest: () => {
        showCrack(true);
      }
    }),
    useSpring({
      position: "relative",
      top: 11,
      from: { top: 120 }
    })
  ];
  const renderedChildren = children.map((child, key) => {
    return (
      <animated.div style={props[key]} key={key}>
        {child}
      </animated.div>
    );
  });
  return renderedChildren;
}
