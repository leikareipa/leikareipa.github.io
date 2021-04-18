"use strict";

import { ll_assert, ll_assert_native_type } from "./assert.js";
export function darken_viewport(args = {}) {
  ll_assert_native_type("object", args);
  args = { ...darken_viewport.defaultArgs,
    ...args
  };
  const shadeId = random_id();
  const transitionDuration = 0.2;

  const shadeElement = (() => {
    const element = document.createElement("div");
    element.id = shadeId;
    element.onclick = args.onClick;
    element.style.cssText = `background-color: black;
                                 position: fixed;
                                 top: 0;
                                 left: 0;
                                 width: 100%;
                                 height: 100%;
                                 opacity: 0;
                                 transition: opacity ${transitionDuration}s linear;
                                 z-index: ${args.z};`;
    document.body.appendChild(element);
    return element;
  })();

  const publicInterface = Object.freeze({
    id: shadeId,
    remove: () => {
      return new Promise(resolve => {
        if (!shadeId) {
          resolve();
          return;
        }

        shadeElement.style.opacity = "0";
        setTimeout(() => {
          shadeElement.remove();
          resolve();
        }, transitionDuration * 1000);
      });
    }
  });
  return new Promise(resolve => {
    if (!shadeId) {
      resolve(publicInterface);
      return;
    }

    shadeElement.style.zIndex = args.z;
    shadeElement.onclick = args.onClick;
    shadeElement.style.opacity = `${window.getComputedStyle(shadeElement).opacity + args.opacity}`;
    setTimeout(() => {
      resolve(publicInterface);
    }, transitionDuration * 1000);
  });

  function random_id() {
    let loops = 0;
    let seed = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._"];
    let id = null;

    do {
      if (++loops > 100) {
        return null;
      }

      for (let shuffle = 0; shuffle < seed.length * 2; shuffle++) {
        const rand1 = Math.min(seed.length - 1, Math.floor(Math.random() * seed.length));
        const rand2 = Math.min(seed.length - 1, Math.floor(Math.random() * seed.length));
        [seed[rand1], seed[rand2]] = [seed[rand2], seed[rand1]];
      }

      if (seed[0].match(/[0-9]/)) {
        seed[0] = "b";
      }

      id = `shades-generated-kpAOerCd4-${seed.join("")}`;
    } while (document.getElementById(id));

    ll_assert(id, "Failed to generate a random shade id.");
    return id;
  }
}
darken_viewport.defaultArgs = {
  z: 100,
  opacity: 0.4,
  onClick: () => {}
};