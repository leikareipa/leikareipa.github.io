"use strict";

import { translations } from "./translations.js";
import { ll_assert_native_type } from "./assert.js";
import { store } from "./redux-store.js";
export function tr(originalString = "", ...values) {
  ll_assert_native_type("string", originalString);
  const dstLanguage = store.getState().language || "fiFI";

  let translatedString = (() => {
    if (dstLanguage === "enEN") {
      return originalString;
    }

    const translationEntry = translations[originalString] || [];
    const translatedString = translationEntry[dstLanguage] || null;

    if (translatedString === null) {
      console.warn("Untranslated string:", originalString);
    }

    return translatedString;
  })();

  values.forEach((value, idx) => {
    translatedString = translatedString.replace(new RegExp(`%${idx + 1}`, "g"), value);
  });
  return translatedString;
}