"use strict";

import { tr } from "./translator.js";
import { LL_PublicError } from "./public-error.js";
import { LL_PrivateError } from "./private-error.js";
export function ll_error_popup(error = {}) {
  if (LL_PublicError.is_parent_of(error)) {
    console.log(tr("Encountered an error"), error.message);
    window.alert(`${tr("Encountered an error")}: ${error.message}`);
  } else if (LL_PrivateError.is_parent_of(error)) {
    console.error("Lintulista:", error.message);
  } else {
      console.error(error);
    }
}