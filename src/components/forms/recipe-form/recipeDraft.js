import { useEffect } from "react";
import { useFormikContext } from "formik";

import { loadJSON, removeKey, saveJSON } from "../../../utils/storage";
import { initialValues } from "./recipeSchema";

export const RECIPE_DRAFT_KEY = "foodies:recipe-draft";
const SAVE_DELAY = 500;

// The photo (a File) can't be stored, so the draft keeps everything else.
const toDraft = ({ photo: _photo, ...rest }) => rest;

const isEmptyDraft = (draft) =>
  !draft.title?.trim() &&
  !draft.description?.trim() &&
  !draft.category &&
  !draft.area &&
  !draft.instructions?.trim() &&
  !(draft.ingredients?.length > 0);

export const loadRecipeDraft = () => {
  const saved = loadJSON(RECIPE_DRAFT_KEY, null);
  if (!saved || typeof saved !== "object" || isEmptyDraft(saved)) return null;

  return {
    ...initialValues,
    ...saved,
    ingredients: Array.isArray(saved.ingredients)
      ? saved.ingredients.filter((item) => item?.id)
      : [],
    photo: null,
  };
};

export const clearRecipeDraft = () => removeKey(RECIPE_DRAFT_KEY);

// Renders nothing: saves the form values to localStorage while typing.
export function DraftAutosave() {
  const { values, isSubmitting } = useFormikContext();

  useEffect(() => {
    if (isSubmitting) return undefined;

    const id = setTimeout(() => {
      const draft = toDraft(values);

      if (isEmptyDraft(draft)) {
        clearRecipeDraft();
      } else {
        saveJSON(RECIPE_DRAFT_KEY, draft);
      }
    }, SAVE_DELAY);

    return () => clearTimeout(id);
  }, [values, isSubmitting]);

  return null;
}
