"use strict";

import { LL_Observation } from "./observation.js";
import { LL_Bird } from "./bird.js";
import { LL_Action } from "./action.js";
import { LL_Backend } from "./backend.js";
import { ll_assert_type } from "./assert.js";
export const lla_add_observation = LL_Action({
  failMessage: "Failed to add the observation",
  successMessage: "The observation has been added",
  act: async function ({
    bird,
    backend
  }) {
    ll_assert_type(LL_Bird, bird);
    ll_assert_type(LL_Backend, backend);
    const date = new Date();
    const observation = LL_Observation({
      species: bird.species,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });
    await backend.add_observation(observation);
    return true;
  }
});