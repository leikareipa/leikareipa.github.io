"use strict";

import { ll_assert_native_type } from "../../assert.js";
import { tr } from "../../translator.js";
export function ObservationListFootnotes(props = {}) {
  ObservationListFootnotes.validate_props(props);
  const obsCount = props.numObservationsInList ? React.createElement(React.Fragment, null, tr("The list has %1 species", props.numObservationsInList), ".") : React.createElement(React.Fragment, null, tr("The list is currently empty"));
  const obsDownload = props.numObservationsInList ? React.createElement("span", {
    onClick: props.callbackDownloadList,
    style: {
      textDecoration: "underline",
      cursor: "pointer",
      fontVariant: "normal"
    }
  }, tr("Download as CSV")) : React.createElement(React.Fragment, null);
  return React.createElement("div", {
    className: "ObservationListFootnotes"
  }, React.createElement("div", {
    className: "observation-count"
  }, obsCount, "\xA0", obsDownload));
}

ObservationListFootnotes.validate_props = function (props) {
  ll_assert_native_type("object", props);
  ll_assert_native_type("number", props.numObservationsInList);
  ll_assert_native_type("function", props.callbackDownloadList);
  return;
};