import { useEffect, useRef } from "react";
import { useFormikContext } from "formik";

const fieldSelectors = {
  photo: ".recipe-form__photo",
  title: '[name="title"]',
  description: '[name="description"]',
  category: ".recipe-form__group--category",
  time: ".recipe-form__group--time",
  area: ".recipe-form__group--area",
  ingredients: ".recipe-form__ingredients",
  instructions: '[name="instructions"]',
};

function ScrollToFirstError() {
  const { errors, isSubmitting, isValidating, submitCount } =
    useFormikContext();

  const lastHandledSubmit = useRef(0);

  useEffect(() => {
    if (
      submitCount === 0 ||
      submitCount <= lastHandledSubmit.current ||
      isSubmitting ||
      isValidating
    ) {
      return;
    }

    lastHandledSubmit.current = submitCount;

    const firstInvalidField = Object.keys(fieldSelectors).find((fieldName) =>
      Boolean(errors[fieldName]),
    );

    if (!firstInvalidField) return;

    const element = document.querySelector(fieldSelectors[firstInvalidField]);

    if (!element) return;

    element.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "center",
    });
  }, [errors, isSubmitting, isValidating, submitCount]);

  return null;
}

export default ScrollToFirstError;
