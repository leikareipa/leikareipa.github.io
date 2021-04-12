"use strict";

import { ll_assert_native_type } from "../../assert.js";
import { LL_PrivateError } from "../../private-error.js";
import { Scroller } from "./Scroller.js";
export function ScrollerLabel(props = {}) {
  ScrollerLabel.validate_props(props);
  const language = ReactRedux.useSelector(state => state.language);
  const [underlyingValue, setUnderlyingValue] = React.useState(props.value);
  let value = underlyingValue;
  React.useEffect(() => {
    props.onChange(underlyingValue);
    return () => props.onChange(underlyingValue);
  }, [underlyingValue]);
  return React.createElement("div", {
    className: "ScrollerLabel"
  }, React.createElement(Scroller, {
    icon: "fas fa-caret-up fa-2x",
    additionalClassName: "up",
    callback: () => scroll_value(1)
  }), React.createElement("div", {
    className: "value"
  }, `${displayable_value()}${props.suffix || ""}`), React.createElement(Scroller, {
    icon: "fas fa-caret-down fa-2x",
    additionalClassName: "down",
    callback: () => scroll_value(-1)
  }));

  function scroll_value(direction = 1) {
    value = value + direction < props.min ? props.max : value + direction > props.max ? props.min : value + direction;
    setUnderlyingValue(value);
  }

  function displayable_value() {
    switch (props.type) {
      case "integer":
        return underlyingValue;

      case "month-name":
        return month_name(underlyingValue - 1, language);

      default:
        throw LL_PrivateError("Unknown value type.");
    }
  }

  function month_name(idx = 0, language = "fiFI") {
    const monthNames = {
      fiFI: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
      enEN: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      lat: ["Ianuarius", "Februarius", "Martius", "Aprilis", "Maius", "Iunius", "Iulius", "Augustus", "September", "October", "November", "December"]
    };
    return (monthNames[language] || monthNames["fiFI"])[idx % 12];
  }
}

ScrollerLabel.validate_props = function (props) {
  ll_assert_native_type("object", props);
  ll_assert_native_type("string", props.type);
  ll_assert_native_type("number", props.min, props.max, props.value);
  ll_assert_native_type("function", props.onChange);
  return;
};