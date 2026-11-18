import { useId, useMemo, useState } from "react";
import { FieldArray, useFormikContext } from "formik";

import chevronIcon from "../../../assets/icons/add-recipe/chevron-down.svg";
import plusIcon from "../../../assets/icons/add-recipe/plus-small.svg";
import closeIcon from "../../../assets/icons/add-recipe/close.svg";

import { FieldError } from "./fields";
import { MEASURE_MAX } from "./recipeSchema";

const EMPTY_DRAFT = { id: "", measure: "" };

function IngredientsField({ options = [], isLoading }) {
  const { values } = useFormikContext();
  const selectId = useId();
  const measureId = useId();

  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [draftErrors, setDraftErrors] = useState({});
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const optionsById = useMemo(
    () => new Map(options.map((option) => [option.id, option])),
    [options],
  );

  const addedIds = new Set(values.ingredients.map(({ id }) => id));

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return options.filter(
      (option) =>
        !addedIds.has(option.id) &&
        option.name.toLocaleLowerCase().startsWith(query),
    );
  }, [options, search, values.ingredients]);

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
          setSearch("");
          setIsOpen(false);
        };

        const handleMeasureKeyDown = (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleAdd();
          }
        };

        const handleSelect = (option) => {
          updateDraft("id", option.id);
          setSearch(option.name);
          setIsOpen(false);
        };

        return (
          <div className="recipe-form__ingredients">
            <div className="recipe-form__ingredient-row">
              <div className="recipe-form__group recipe-form__group--ingredient">
                <label htmlFor={selectId} className="recipe-form__label">
                  Ingredients
                </label>

                <div className="recipe-form__search-select-wrap">
                  <div className="recipe-form__select-wrap">
                    <input
                      id={selectId}
                      type="text"
                      role="combobox"
                      autoComplete="off"
                      value={
                        isOpen
                          ? search
                          : draft.id
                            ? (optionsById.get(draft.id)?.name ?? search)
                            : search
                      }
                      placeholder={
                        isLoading ? "Loading..." : "Add the ingredient"
                      }
                      disabled={isLoading}
                      aria-expanded={isOpen}
                      aria-controls={`${selectId}-options`}
                      aria-autocomplete="list"
                      aria-invalid={Boolean(draftErrors.id)}
                      onFocus={() => {
                        setSearch("");
                        setIsOpen(true);
                      }}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setDraft((current) => ({ ...current, id: "" }));
                        setDraftErrors((current) => ({
                          ...current,
                          id: undefined,
                        }));
                        setIsOpen(true);
                      }}
                      onBlur={() => {
                        setTimeout(() => setIsOpen(false), 150);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          setIsOpen(false);
                        }

                        if (event.key === "Enter" && isOpen) {
                          event.preventDefault();

                          if (filteredOptions.length > 0) {
                            handleSelect(filteredOptions[0]);
                          }
                        }
                      }}
                      className={`recipe-form__select ${
                        draft.id ? "" : "recipe-form__select--placeholder"
                      }`}
                    />

                    <img
                      src={chevronIcon}
                      width="18"
                      height="18"
                      alt=""
                      className={`recipe-form__select-icon ${
                        isOpen ? "recipe-form__select-icon--open" : ""
                      }`}
                    />
                  </div>

                  {isOpen && (
                    <div className="recipe-form__dropdown">
                      <ul
                        id={`${selectId}-options`}
                        className="recipe-form__options-list"
                        role="listbox"
                      >
                        {filteredOptions.length > 0 ? (
                          filteredOptions.map((option) => (
                            <li
                              key={option.id}
                              role="option"
                              aria-selected={false}
                            >
                              <button
                                type="button"
                                className="recipe-form__option"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => handleSelect(option)}
                              >
                                {option.name}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="recipe-form__no-results">
                            No results found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
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
