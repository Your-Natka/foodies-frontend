import { useId, useMemo, useState } from "react";
import { FieldArray, useFormikContext } from "formik";

import chevronIcon from "../../../assets/icons/add-recipe/chevron-down.svg";
import plusIcon from "../../../assets/icons/add-recipe/plus-small.svg";
import closeIcon from "../../../assets/icons/add-recipe/close.svg";

import { FieldError } from "./fields";
import { MEASURE_MAX } from "./recipeSchema";

const EMPTY_DRAFT = { id: "", measure: "" };

function IngredientsField({ options, isLoading }) {
  const { values } = useFormikContext();
  const selectId = useId();
  const measureId = useId();

  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [draftErrors, setDraftErrors] = useState({});

  const optionsById = useMemo(
    () => new Map(options.map((option) => [option.id, option])),
    [options],
  );

  const addedIds = new Set(values.ingredients.map(({ id }) => id));

  const updateDraft = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setDraftErrors((current) => ({ ...current, [key]: undefined }));
  };

  return (
    <FieldArray name="ingredients">
      {({ push, remove }) => {
        const handleAdd = () => {
          const measure = draft.measure.trim();
          const errors = {};

          if (!draft.id) {
            errors.id = "Select an ingredient";
          } else if (addedIds.has(draft.id)) {
            errors.id = "This ingredient is already added";
          }

          if (!measure) {
            errors.measure = "Enter quantity";
          } else if (measure.length > MEASURE_MAX) {
            errors.measure = `Quantity must be at most ${MEASURE_MAX} characters`;
          }

          setDraftErrors(errors);
          if (Object.keys(errors).length > 0) return;

          push({ id: draft.id, measure });
          setDraft(EMPTY_DRAFT);
        };

        const handleMeasureKeyDown = (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleAdd();
          }
        };

        return (
          <div className="recipe-form__ingredients">
            <div className="recipe-form__ingredient-row">
              <div className="recipe-form__group recipe-form__group--ingredient">
                <label htmlFor={selectId} className="recipe-form__label">
                  Ingredients
                </label>
                <div className="recipe-form__select-wrap">
                  <select
                    id={selectId}
                    value={draft.id}
                    disabled={isLoading}
                    aria-invalid={Boolean(draftErrors.id)}
                    onChange={(event) => updateDraft("id", event.target.value)}
                    className={`recipe-form__select ${
                      draft.id ? "" : "recipe-form__select--placeholder"
                    }`}
                  >
                    <option value="" disabled>
                      {isLoading ? "Loading..." : "Add the ingredient"}
                    </option>
                    {options.map((option) => (
                      <option
                        key={option.id}
                        value={option.id}
                        disabled={addedIds.has(option.id)}
                      >
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <img
                    src={chevronIcon}
                    width="18"
                    height="18"
                    alt=""
                    className="recipe-form__select-icon"
                  />
                </div>
                {draftErrors.id && (
                  <p className="recipe-form__error" role="alert">
                    {draftErrors.id}
                  </p>
                )}
              </div>

              <div className="recipe-form__group recipe-form__group--measure">
                <label htmlFor={measureId} className="visually-hidden">
                  Quantity
                </label>
                <input
                  id={measureId}
                  type="text"
                  value={draft.measure}
                  placeholder="Enter quantity"
                  aria-invalid={Boolean(draftErrors.measure)}
                  onChange={(event) =>
                    updateDraft("measure", event.target.value)
                  }
                  onKeyDown={handleMeasureKeyDown}
                  className="recipe-form__line-input"
                />
                {draftErrors.measure && (
                  <p className="recipe-form__error" role="alert">
                    {draftErrors.measure}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              className="recipe-form__add-button"
              onClick={handleAdd}
              disabled={isLoading}
            >
              Add ingredient
              <img src={plusIcon} width="22" height="22" alt="" />
            </button>

            {values.ingredients.length > 0 && (
              <ul className="recipe-form__ingredient-list">
                {values.ingredients.map((item, index) => {
                  const ingredient = optionsById.get(item.id);
                  const name = ingredient?.name ?? "Ingredient";

                  return (
                    <li key={item.id} className="recipe-form__ingredient-card">
                      <div className="recipe-form__ingredient-thumb">
                        {ingredient?.img && (
                          <img
                            src={ingredient.img}
                            alt=""
                            width="60"
                            height="60"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="recipe-form__ingredient-text">
                        <p className="recipe-form__ingredient-name">{name}</p>
                        <p className="recipe-form__ingredient-measure">
                          {item.measure}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="recipe-form__ingredient-remove"
                        onClick={() => remove(index)}
                        aria-label={`Remove ${name}`}
                      >
                        <img src={closeIcon} width="16" height="16" alt="" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <FieldError name="ingredients" />
          </div>
        );
      }}
    </FieldArray>
  );
}

export default IngredientsField;
