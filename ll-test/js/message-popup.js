"use strict";

import { tr } from "./translator.js";
import { LL_PublicError } from "./public-error.js";
import { LL_PrivateError } from "./private-error.js";
export function ll_error_popup(error = {}) {
  const errorMessage = error.message || error.reason.message || "Unknown error";

  if (LL_PublicError.is_parent_of(error)) {
    console.log(tr("Encountered an error"), errorMessage);
    window.alert(`${tr("Encountered an error")}: ${errorMessage}`);
  } else if (LL_PrivateError.is_parent_of(error)) {
    console.error(`Lintulista: ${errorMessage}`);
  } else {
      console.log(`External error: ${errorMessage}`);
    }

  console.error(error);
}