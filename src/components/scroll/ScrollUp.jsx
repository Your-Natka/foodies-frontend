import { useEffect, useState } from "react";
import css from "./ScrollUp.module.scss";

const ScrollUp = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 1000);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    const target =
      document.querySelector("[data-category-recipes-section]") ||
      document.querySelector("[data-categories-section]");

    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 130;

      window.scrollTo({
        top,
        behavior: "smooth",
      });

      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      className={`${css.scrollBtn} ${isVisible ? css.visible : ""}`}
      aria-label="Scroll to section top"
      onClick={handleClick}
    >
      <svg className={css.icon} aria-hidden="true">
        <use href="/icons.svg#icon-arrow-up-right" />
      </svg>
    </button>
  );
};

export default ScrollUp;
