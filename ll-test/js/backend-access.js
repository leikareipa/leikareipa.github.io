"use strict";

import { tr } from "./translator.js";
import { ll_public_assert, ll_assert, ll_assert_type, ll_assert_native_type } from "./assert.js";
import { BackendRequest } from "./backend-request.js";
import { LL_Observation } from "./observation.js";
import { LL_Bird } from "./bird.js";
export async function BackendAccess(listKey, reduxStore) {
  const knownBirds = Object.freeze((await BackendRequest.get_known_birds_list()));
  reduxStore.dispatch({
    type: "set-known-birds",
    knownBirds: knownBirds.reduce((list, bird) => {
      list.push(LL_Bird.clone(bird));
      return list;
    }, [])
  });
  const observations = await BackendRequest.get_observations(listKey);
  update_observation_store(observations);
  let loginToken = null;
  let loginValidUntil = undefined;
  const publicInterface = {
    login: async function (username, password) {
      const loginDetails = await BackendRequest.login(listKey, username, password);
      ll_public_assert(loginDetails, tr("Login failed"));
      ll_public_assert(typeof loginDetails.token === "string" && typeof loginDetails.until === "number", tr("Invalid server response"));
      loginToken = loginDetails.token;
      loginValidUntil = loginDetails.until;
      reduxStore.dispatch({
        type: "set-logged-in",
        isLoggedIn: true
      });
      return;
    },
    logout: async function () {
      ll_assert(loginToken !== null, "Trying to log out without having been logged in.");
      ll_public_assert((await BackendRequest.logout(listKey, loginToken)), tr("Logout failed"));
      loginToken = null;
      loginValidUntil = undefined;
      reduxStore.dispatch({
        type: "set-logged-in",
        isLoggedIn: false
      });
      return;
    },
    delete_observation: async function (observation = LL_Observation) {
      ll_assert_native_type("string", listKey);
      ll_assert_type(LL_Observation, observation);
      const obsIdx = observations.findIndex(obs => obs.species === observation.species);
      ll_public_assert(obsIdx >= 0, tr("Unrecognized observation data"));
      const wasSuccess = await BackendRequest.delete_observation(observation, listKey, loginToken);
      ll_public_assert(wasSuccess, tr("Failed to remove the observation"));
      observations.splice(obsIdx, 1);
      update_observation_store(observations);
      return;
    },
    add_observation: async function (observation = LL_Observation) {
      ll_assert_type(LL_Observation, observation);
      const obsIdx = observations.findIndex(obs => obs.species === observation.species);
      const isExistingObservation = obsIdx >= 0;
      const wasSuccess = await BackendRequest.put_observation(observation, listKey, loginToken);
      ll_public_assert(wasSuccess, tr(isExistingObservation ? "Failed to update the observation" : "Failed to add the observation"));
      observations.splice(obsIdx, obsIdx !== -1, observation);
      update_observation_store(observations);
      return;
    }
  };
  return publicInterface;

  function update_observation_store(observations = [LL_Observation]) {
    reduxStore.dispatch({
      type: "set-observations",
      observations: observations.reduce((list, obs) => {
        list.push(LL_Observation.clone(obs));
        return list;
      }, [])
    });
    return;
  }
}
BackendAccess.create_new_list = BackendRequest.create_new_list;
BackendAccess.get_known_birds_list = BackendRequest.get_known_birds_list;