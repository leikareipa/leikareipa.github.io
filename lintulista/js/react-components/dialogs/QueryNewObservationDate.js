"use strict";

import { ll_assert_native_type, ll_assert_type } from "../../assert.js";
import { ScrollerLabel } from "../scroller-label/ScrollerLabel.js";
import { BirdThumbnail } from "../misc/BirdThumbnail.js";
import { Dialog } from "./Dialog.js";
import { tr } from "../../translator.js";
import { LL_Observation } from "../../observation.js";
export function QueryNewObservationDate(props = {}) {
  QueryNewObservationDate.validateProps(props);
  const language = ReactRedux.useSelector(state => state.language);
  let day = props.args.observation.day;
  let month = props.args.observation.month;
  let year = props.args.observation.year;
  return React.createElement(Dialog, {
    component: "QueryNewObservationDate",
    title: tr("Date of observation"),
    enterAccepts: true,
    acceptButtonIcon: "fas fa-clock",
    rejectButtonText: tr("Cancel"),
    acceptButtonText: tr("Save"),
    onDialogAccept: accept,
    onDialogReject: props.onReject
  }, React.createElement(BirdThumbnail, {
    species: props.args.observation.species,
    useLazyLoading: false
  }), React.createElement("div", {
    className: "fields"
  }, React.createElement("div", {
    className: "bird-name"
  }, props.args.observation.species), React.createElement("div", {
    className: "date-bar"
  }, React.createElement("div", {
    className: "day"
  }, React.createElement(ScrollerLabel, {
    type: "integer",
    min: 1,
    max: 31,
    suffix: language == "fiFI" ? "." : "",
    value: day,
    onChange: value => {
      day = value;
    }
  })), React.createElement("div", {
    className: "month"
  }, React.createElement(ScrollerLabel, {
    type: "month-name",
    min: 1,
    max: 12,
    suffix: language == "fiFI" ? "ta" : "",
    value: month,
    onChange: value => {
      month = value;
    }
  })), React.createElement("div", {
    className: "year"
  }, React.createElement(ScrollerLabel, {
    type: "integer",
    min: 1,
    max: 5000,
    suffix: "",
    value: year,
    onChange: value => {
      year = value;
    }
  })))));

  function accept() {
    props.return.day = day;
    props.return.month = month;
    props.return.year = year;
    props.onAccept();
  }
}

QueryNewObservationDate.validateProps = function (props) {
  ll_assert_native_type("object", props, props.args, props.return);
  ll_assert_native_type("function", props.onAccept, props.onReject);
  ll_assert_type(LL_Observation, props.args.observation);
  return;
};