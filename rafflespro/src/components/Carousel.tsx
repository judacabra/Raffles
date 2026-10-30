
import { RefObject, useRef, } from "react";

import { tr } from "../i18n/translations";

import "../styles/Carousel.css";

export const Carousel = (
  { items, lang }: 
  { items: any, lang: "es" | "en" }
) => {
  const carouselRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right"): void => {
    if (!carouselRef.current) return;

    const container: HTMLDivElement = carouselRef.current;
    const item: Element | null = container.querySelector(".carousel-item");

    if (!item) return;

    const itemWidth: number = item.getBoundingClientRect().width;
    const gap: number = 20;

    container.scrollBy({
      left: direction === "right"
        ? (itemWidth + gap) * 3
        : -(itemWidth + gap) * 3,
      behavior: "smooth",
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="carousel-wrapper">
      <button
        className="carousel-button"
        onClick={() => scroll("left")}
        aria-label="Imágenes anteriores"
        style={{ transform: "rotate(180deg)", paddingBottom: 3, fontSize: 30, }}
        title={tr("prev", lang)}
      >
        ➜
      </button>

      <div className="carousel" ref={carouselRef}>
        {items.map((item: any, index: any) => (
          <div className="carousel-item" key={index}>
            {item}
          </div>
        ))}
      </div>

      <button
        className="carousel-button"
        onClick={() => scroll("right")}
        aria-label="Imágenes siguientes"
        style={{ paddingBottom: 2, fontSize: 30, }}
        title={tr("next", lang)}
      >
        ➜
      </button>

    </div>
  );
};
