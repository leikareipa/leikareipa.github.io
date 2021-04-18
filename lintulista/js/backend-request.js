"use strict";

import { ll_assert, ll_assert_native_type, ll_assert_type } from "./assert.js";
import { LL_Observation } from "./observation.js";
import { LL_Bird } from "./bird.js";
import { LL_Throwable } from "./throwable.js";
const backendURLs = {
  lists: "https://lintulista-server.herokuapp.com",
  login: "https://lintulista-server.herokuapp.com/login",
  metadata: "./server/api/metadata.php",
  knownBirdSpecies: "./server/metadata/known-birds.json"
};
export const ll_backend_request = {
  make_request: async function (url = "", params = {}) {
    ll_assert_native_type("string", url);
    ll_assert_native_type("object", params);
    let response = await fetch(url, params);
    ll_assert(response.ok, `${response.status} ${response.statusText}`);
    response = await response.json();
    ll_assert_native_type("object", response, response.data);
    ll_assert_native_type("boolean", response.valid);
    ll_assert(response.valid, response.data.message);
    return response.data;
  },
  login: async function (listKey, username, password) {
    const responseData = await this.make_request(`${backendURLs.login}?list=${listKey}`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    });
    return responseData;
  },
  logout: async function (listKey, token) {
    await this.make_request(`${backendURLs.login}?list=${listKey}`, {
      method: "DELETE",
      body: JSON.stringify({
        token
      })
    });
    return;
  },
  delete_observation: async function (observation, listKey, token) {
    ll_assert_type(LL_Observation, observation);
    ll_assert_native_type("string", listKey, token);
    await this.make_request(`${backendURLs.lists}?list=${listKey}`, {
      method: "DELETE",
      body: JSON.stringify({
        token,
        species: observation.species
      })
    });
    return;
  },
  get_known_birds_list: async function () {
    let response = await fetch(backendURLs.knownBirdSpecies);

    if (!response.ok) {
      throw LL_Throwable(response.statusText);
    }

    response = await response.json();
    ll_assert_native_type("array", response.birds);
    return response.birds.map(b => LL_Bird(b.species));
  },
  get_observations: async function (listKey) {
    ll_assert_native_type("string", listKey);
    const responseData = await this.make_request(`${backendURLs.lists}?list=${listKey}`, {
      method: "GET"
    });
    ll_assert_native_type("array", responseData.observations);
    return responseData.observations.map(obs => LL_Observation(obs));
  },
  put_observation: async function (observation = LL_Observation, listKey = "", token = "") {
    ll_assert_native_type("string", listKey, token);
    ll_assert_type(LL_Observation, observation);
    await this.make_request(`${backendURLs.lists}?list=${listKey}`, {
      method: "PUT",
      body: JSON.stringify({
        token,
        species: observation.species,
        day: observation.day,
        month: observation.month,
        year: observation.year
      })
    });
    return;
  }
};