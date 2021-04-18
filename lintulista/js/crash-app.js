"use strict";

let appHasCrashed = false;
export function ll_crash_app(error) {
  if (appHasCrashed) {
    return;
  } else {
    appHasCrashed = true;
  }

  let errorMessage = "Unknown error";

  if (typeof error === "string") {
    errorMessage = error;
  } else if (typeof error === "object" && typeof error.message === "string") {
    errorMessage = error.message;
  } else if (typeof error === "object" && typeof error.reason === "object" && typeof error.reason.message === "string") {
    errorMessage = error.reason.message;
  }

  const appElement = document.getElementById("lintulista");
  const bluescreenElement = document.getElementById("blue-screen");
  const errorMessageElement = bluescreenElement.querySelector(".error-description");

  if (appElement instanceof Element) {
    appElement.remove();
  }

  if (bluescreenElement instanceof Element && errorMessageElement instanceof Element) {
    errorMessageElement.innerHTML = errorMessage;
    bluescreenElement.style.display = "flex";
  }

  return;
}