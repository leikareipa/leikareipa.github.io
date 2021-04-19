"use strict";

import { LL_Observation } from "./observation.js";
import { LL_Action } from "./action.js";
import { ll_assert_native_type, ll_assert_type } from "./assert.js";
import * as FileSaver from "./filesaver/FileSaver.js";
export const lla_export_observations_to_csv = LL_Action({
  failMessage: "Failed to download CSV",
  act: async function ({
    observations
  }) {
    ll_assert_native_type("array", observations);
    let csvHeader = "Species,Day,Month,Year\n";
    const csv = observations.reduce((string, obs) => {
      ll_assert_type(LL_Observation, obs);
      return string + `${obs.species},${obs.day},${obs.month},${obs.year}\n`;
    }, "");
    saveAs(new Blob([csvHeader + csv], {
      type: "text/csv;charset=utf-8"
    }), "lintulista.csv");
    return true;
  }
});