"use strict";

import { ll_assert_native_type } from "../../assert.js";
import { LL_Bird } from "../../bird.js";
const placeholderThumbnailUrl = "./img/placeholder-bird-thumbnail.png";
const observedImages = new Set([placeholderThumbnailUrl]);
export function BirdThumbnail(props = {}) {
  BirdThumbnail.validate_props(props);
  const bird = LL_Bird(props.species);
  observedImages.add(LL_Bird.nullThumbnailUrl);
  const thumbnailRef = React.createRef();
  const [thumbnailSrc, setThumbnailSrc] = React.useState(() => {
    if (props.useLazyLoading && !observedImages.has(bird.thumbnailUrl)) {
      return placeholderThumbnailUrl;
    } else {
      return bird.thumbnailUrl;
    }
  });
  const [intersectionObserver] = React.useState(() => {
    if (!props.useLazyLoading) {
      return null;
    } else {
      return new IntersectionObserver(([element]) => {
        if (element.isIntersecting) {
          setThumbnailSrc(bird.thumbnailUrl);
          intersectionObserver.disconnect();
        }
      });
    }
  });
  React.useEffect(() => {
    if (thumbnailSrc === bird.thumbnailUrl) {
      mark_thumbnail_observed();
    }
  });
  React.useEffect(() => {
    if (props.useLazyLoading) {
      const isInView = (() => {
        const viewHeight = window.innerHeight;
        const containerRect = thumbnailRef.current.getBoundingClientRect();
        return Boolean(containerRect.top > -containerRect.height && containerRect.top < viewHeight);
      })();

      if (isInView) {
        mark_thumbnail_observed();
        thumbnailRef.current.setAttribute("src", bird.thumbnailUrl);
      } else if (intersectionObserver) {
        intersectionObserver.observe(thumbnailRef.current);
        return () => {
          intersectionObserver.disconnect();
        };
      }
    }
  }, [thumbnailRef.current]);
  return React.createElement("img", {
    className: "BirdThumbnail",
    referrerPolicy: "no-referrer",
    draggable: false,
    src: thumbnailSrc,
    ref: thumbnailRef
  });

  function mark_thumbnail_observed() {
    observedImages.add(bird.thumbnailUrl);
  }
}
BirdThumbnail.defaultProps = {
  useLazyLoading: true
};

BirdThumbnail.validate_props = function (props) {
  ll_assert_native_type("object", props);
  ll_assert_native_type("string", props.species);
  return;
};