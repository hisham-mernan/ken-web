import { useEffect, useRef, useState } from "react";

// lib
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

// utils
import { currentLanguageCode } from "../../../../../utils/switchLang";
import { getImageUrl, IMG } from "../../../../../utils/getImageUrl";

const Chevron = ({ flip }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={flip ? { transform: "scaleX(-1)" } : undefined}
  >
    <path
      d="M15 5L8 12l7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * The hut's photography.
 *
 * Framed at 3:2, the ratio every photo in the set is actually shot at, so
 * nothing is cropped to fit an arbitrary box height. A thumbnail strip stands
 * in for the dots: a hut carries up to sixteen photos, and sixteen dots tell a
 * guest nothing about what they are about to click.
 *
 * The main frame loads on demand. Supabase image transformation is off for
 * this project, so every request returns the full-size object however small
 * the box is -- rendering all sixteen up front cost several megabytes before
 * the guest had scrolled. The strip is a plain scroller rather than a second
 * carousel so the browser's own lazy loading governs it: react-slick's
 * ondemand mode renders un-loaded slides as empty boxes, which left the strip
 * blank on a narrow screen.
 */
const Hut_Gallery = ({ images = [], title = "" }) => {
  const { t } = useTranslation();
  const [mainNav, setMainNav] = useState(null);
  const [index, setIndex] = useState(0);
  // Which thumbnails have scrolled near enough to be worth fetching.
  const [nearThumbs, setNearThumbs] = useState(() => new Set([0, 1, 2, 3, 4, 5]));
  const stripRef = useRef(null);

  const count = images.length;
  const isRtl = currentLanguageCode !== "en";
  const many = count > 1;

  // Keep the active thumbnail in view, without dragging the strip when it
  // already is: `nearest` scrolls only as far as it has to.
  useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.children?.[index];
    active?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  }, [index]);

  // A thumbnail costs a full-size download, so only fetch the ones the guest
  // can nearly see. `loading="lazy"` does not help here: the browser treats a
  // horizontal scroller as on-screen and fetches the whole strip at once.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const io = new IntersectionObserver(
      (entries) => {
        const arrived = entries
          .filter((e) => e.isIntersecting)
          .map((e) => Number(e.target.dataset.i));
        if (!arrived.length) return;
        setNearThumbs((prev) => {
          const next = new Set(prev);
          arrived.forEach((i) => next.add(i));
          return next.size === prev.size ? prev : next;
        });
      },
      { root: strip, rootMargin: "300px" }
    );
    Array.from(strip.children).forEach((child) => io.observe(child));
    return () => io.disconnect();
  }, [count]);

  if (!count) return null;

  const mainSettings = {
    rtl: isRtl,
    infinite: false,
    arrows: false,
    dots: false,
    lazyLoad: "ondemand",
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    beforeChange: (_, next) => setIndex(next),
  };

  // In RTL the visually-left control advances the deck, so map the arrows to
  // direction of travel rather than to slickPrev/slickNext by name.
  const step = (back) => {
    if (!mainNav) return;
    (isRtl ? !back : back) ? mainNav.slickPrev() : mainNav.slickNext();
  };

  const arrow =
    "absolute top-1/2 -translate-y-1/2 z-10 flex_center w-9 h-9 rounded-full bg-off-white/80 hover:bg-off-white text-primary-dark shadow-md backdrop-blur-sm transition disabled:opacity-0 disabled:pointer-events-none";

  return (
    <figure className="w-full max-w-[690px] xl:mx-auto flex flex-col gap-3">
      <div className="relative">
        <Slider {...mainSettings} ref={setMainNav}>
          {images.map((item, i) => (
            <div key={item?.id ?? i}>
              <div className="aspect-[3/2] w-full overflow-hidden rounded-lg bg-primary-5/40">
                <img
                  src={getImageUrl(item?.image, { width: IMG.hero })}
                  alt={title || t("huts")}
                  // The first frame is the one the guest is waiting on; the
                  // rest are fetched as they are reached.
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </Slider>

        {many && (
          <>
            <button
              type="button"
              aria-label={t("previous") || "Previous"}
              onClick={() => step(true)}
              disabled={index === 0}
              className={`${arrow} start-3`}
            >
              <Chevron flip={isRtl} />
            </button>
            <button
              type="button"
              aria-label={t("next") || "Next"}
              onClick={() => step(false)}
              disabled={index === count - 1}
              className={`${arrow} end-3`}
            >
              <Chevron flip={!isRtl} />
            </button>

            <span className="absolute bottom-3 end-3 z-10 rounded-full bg-primary-dark/70 text-off-white text-xs px-2.5 py-1 backdrop-blur-sm tabular-nums">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {many && (
        <div
          ref={stripRef}
          className="flex gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((item, i) => (
            <button
              key={item?.id ?? i}
              type="button"
              data-i={i}
              onClick={() => mainNav?.slickGoTo(i)}
              aria-label={`${t("huts")} ${i + 1}`}
              aria-current={i === index}
              // The tint sits on the button so a thumbnail that has not arrived yet
              // reads as a tile loading, not as a gap in the strip.
              className={`shrink-0 basis-[22%] min-w-[84px] aspect-[3/2] overflow-hidden rounded-md bg-primary-5/40 transition ${
                i === index
                  ? "ring-2 ring-primary-3 opacity-100"
                  : "opacity-55 hover:opacity-90"
              }`}
            >
              {nearThumbs.has(i) || i === index ? (
                <img
                  src={getImageUrl(item?.image, { width: IMG.thumb })}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </button>
          ))}
        </div>
      )}
    </figure>
  );
};

export default Hut_Gallery;
