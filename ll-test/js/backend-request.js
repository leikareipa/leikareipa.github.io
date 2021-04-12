"use strict";

import { ll_assert_native_type, ll_assert_type } from "./assert.js";
import { LL_Observation } from "./observation.js";
import { LL_Bird } from "./bird.js";
import { LL_PrivateError } from "./private-error.js";
import { ll_error_popup } from "./message-popup.js";
const backendURLs = {
  lists: "https://lintulista-server.herokuapp.com",
  login: "https://lintulista-server.herokuapp.com/login",
  metadata: "./server/api/metadata.php",
  knownBirdSpecies: "./server/metadata/known-birds.json"
};
export const BackendRequest = {
  make_request: function (url = "", params = {}) {
    ll_assert_native_type("string", url);
    ll_assert_native_type("object", params);
    return fetch(url, params).then(response => {
      if (!response.ok) {
        throw LL_PrivateError(response.statusText);
      }

      return response.json();
    }).then(ticket => {
      if (typeof ticket !== "object" || ticket.valid !== true) {
        if (typeof ticket.data !== "object") {
          throw LL_PrivateError("Malformed server response.");
        }

        const errorMessage = ticket.data.hasOwnProperty("message") ? ticket.data.message : "Unknown error";
        throw LL_PrivateError(errorMessage);
      }

      return [true, ticket.data];
    }).catch(error => {
      ll_error_popup(error);
      return [false, null];
    });
  },
  login: async function (listKey, username, password) {
    const [wasSuccessful, responseData] = await this.make_request(`${backendURLs.login}?list=${listKey}`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    });
    return wasSuccessful ? responseData : false;
  },
  logout: async function (listKey, token) {
    const [wasSuccessful] = await this.make_request(`${backendURLs.login}?list=${listKey}`, {
      method: "DELETE",
      body: JSON.stringify({
        token
      })
    });
    return wasSuccessful;
  },
  delete_observation: async function (observation, listKey, token) {
    ll_assert_type(LL_Observation, observation);
    ll_assert_native_type("string", listKey, token);
    const [wasSuccessful] = await this.make_request(`${backendURLs.lists}?list=${listKey}`, {
      method: "DELETE",
      body: JSON.stringify({
        token,
        species: observation.species
      })
    });
    return wasSuccessful;
  },
  get_known_birds_list: async function () {
    try {
      let response = await fetch(backendURLs.knownBirdSpecies);

      if (!response.ok) {
        throw LL_PrivateError(response.statusText);
      }

      response = await response.json();
      ll_assert_native_type("array", response.birds);
      return response.birds.map(b => LL_Bird(b.species));
    } catch (error) {
      ll_error_popup(error);
      return [];
    }
  },
  get_observations: async function (listKey) {
    ll_assert_native_type("string", listKey);
    const [wasSuccessful, responseData] = await this.make_request(`${backendURLs.lists}?list=${listKey}`, {
      method: "GET"
    });

    if (!wasSuccessful) {
      return [];
    }

    ll_assert_native_type("array", responseData.observations);
    return responseData.observations.map(obs => LL_Observation(obs));
  },
  put_observation: async function (observation = LL_Observation, listKey = "", token = "") {
    ll_assert_native_type("string", listKey, token);
    ll_assert_type(LL_Observation, observation);
    const [wasSuccessful] = await this.make_request(`${backendURLs.lists}?list=${listKey}`, {
      method: "PUT",
      body: JSON.stringify({
        token,
        species: observation.species,
        day: observation.day,
        month: observation.month,
        year: observation.year
      })
    });
    return wasSuccessful;
  }
};