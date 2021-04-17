"use strict";

import { QueryNewObservationDate } from "./react-components/dialogs/QueryNewObservationDate.js";
import { lla_open_dialog } from "./action-open-dialog.js";
import { lla_close_dialog } from "./action-close-dialog.js";
import { LL_Observation } from "./observation.js";
import { LL_Action } from "./action.js";
import { LL_Backend } from "./backend.js";
import { ll_assert, ll_assert_type } from "./assert.js";
export const lla_change_observation_date = LL_Action({
  failMessage: "Failed to save the date",
  successMessage: "The date has been saved",
  act: async function ({
    observation,
    backend
  }) {
    ll_assert_type(LL_Observation, observation);
    ll_assert_type(LL_Backend, backend);
    const newDate = await lla_open_dialog.async_nocatch({
      dialog: QueryNewObservationDate,
      args: {
        observation
      }
    });
    ll_assert(newDate === null || typeof newDate === "object", "Invalid return data.");

    if (newDate) {
      const modifiedObservation = LL_Observation({
        species: observation.species,
        day: newDate.day,
        month: newDate.month,
        year: newDate.year
      });
      await backend.add_observation(modifiedObservation);
      return true;
    }

    return;
  },
  finally: async function () {
    await lla_close_dialog.async({
      dialog: QueryNewObservationDate
    });
  }
});