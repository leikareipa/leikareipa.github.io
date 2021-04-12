"use strict";

import { ll_assert_native_type } from "../../assert.js";
export function Scroller(props = {}) {
  Scroller.validateProps(props);
  const firingLoopDelayMs = 350;
  const firingLoopIntervalMs = 190;
  const [firingLoopCountdown, setFiringLoopCountdown] = React.useState(null);
  const [firingLoop, setFiringLoop] = React.useState(null);
  const [mouseDown, setMouseDown] = React.useState(false);
  React.useEffect(() => {
    if (mouseDown) {
      fire();
      setFiringLoopCountdown(setTimeout(start_firing_loop, firingLoopDelayMs));
    } else {
      clearTimeout(firingLoopCountdown);
      setFiringLoopCountdown(null);
      stop_firing_loop();
    }
  }, [mouseDown]);
  return React.createElement("div", {
    className: `Scroller ${props.additionalClassName || ""}`.trim(),
    onMouseDown: () => setMouseDown(true),
    onMouseUp: () => setMouseDown(false),
    onMouseLeave: () => setMouseDown(false)
  }, React.createElement("i", {
    className: props.icon
  }));

  function start_firing_loop() {
    if (!firingLoop) {
      setFiringLoop(setInterval(fire, firingLoopIntervalMs));
    } else {
      console.warn("A scroller started firing twice.");
    }
  }

  function stop_firing_loop() {
    if (firingLoop) {
      clearInterval(firingLoop);
      setFiringLoop(null);
    }
  }

  function fire() {
    props.callback();
  }
}
Scroller.defaultProps = {
  symbol: "fas fa-question"
};

Scroller.validateProps = function (props) {
  ll_assert_native_type("function", props.callback);
  return;
};