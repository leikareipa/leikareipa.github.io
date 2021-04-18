"use strict";

import { ll_assert_type } from "./assert.js";
import { LL_Observation } from "./observation.js";
const initialState = {
  highlightedSpecies: null,
  isLoggedIn: false,
  is100LajiaMode: false,
  observations: [],
  knownBirds: [],
  language: "fiFI"
};
export const store = Redux.createStore(reducer);

function reducer(state = initialState, action) {
  switch (action.type) {
    case "set-language":
      {
        return { ...state,
          language: action.language
        };
      }

    case "set-100-lajia-mode":
      {
        return { ...state,
          is100LajiaMode: action.isEnabled
        };
      }

    case "set-logged-in":
      {
        return { ...state,
          isLoggedIn: action.isLoggedIn
        };
      }

    case "set-highlighted-species":
      {
        return { ...state,
          highlightedSpecies: action.species
        };
      }

    case "remove-species-highlight":
      {
        return { ...state,
          highlightedSpecies: null
        };
      }

    case "set-observations":
      {
        return { ...state,
          observations: observations_sorted_by_date(action.observations),
          is100LajiaMode: action.observations.length <= 0
        };
      }

    case "set-known-birds":
      {
        return { ...state,
          knownBirds: action.knownBirds
        };
      }

    default:
      return state;
  }
}

function observations_sorted_by_date(observations = [LL_Observation]) {
  const obsCopy = observations.map(o => {
    ll_assert_type(LL_Observation, o);
    return LL_Observation(o);
  });
  obsCopy.sort((a, b) => {
    const timestampA = new Date(a.year, a.month - 1, a.day).getTime();
    const timestampB = new Date(b.year, b.month - 1, b.day).getTime();
    return timestampB - timestampA;
  });
  return obsCopy;
}