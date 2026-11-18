import { useEffect, useRef, useState } from "react";
import css from "./RecipeFilters.module.scss";

const CustomSelect = ({ placeholder, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find(
    (option) => String(option.value) === String(value),
  );

  const normalizedSearch = search.trim().toLocaleLowerCase();

  const filteredOptions = normalizedSearch
    ? options.filter((option) =>
        option.label.toLocaleLowerCase().startsWith(normalizedSearch),
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    setSearch("");
    setIsOpen((previous) => !previous);
  };

  const handleSelect = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={css.selectWrapper} ref={wrapperRef}>
      <button
        type="button"
        className={`${css.select} ${!selectedOption ? css.placeholder : ""}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedOption?.label || placeholder}</span>

        <svg
          className={`${css.chevron} ${isOpen ? css.chevronOpen : ""}`}
          aria-hidden="true"
        >
          <use href="/icons.svg#icon-chevron-down" />
        </svg>
      </button>

      {isOpen && (
        <div className={css.dropdown}>
          <div className={css.searchWrapper}>
            <input
              ref={searchInputRef}
              type="text"
              className={css.searchInput}
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label={`Search ${placeholder}`}
              autoComplete="off"
              style={{ color: "var(--color-black)" }}
            />

            <svg
              className={css.searchIcon}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
          </div>

          {filteredOptions.length > 0 ? (
            <ul className={css.optionsList} role="listbox">
              {filteredOptions.map((option) => {
                const isSelected = String(option.value) === String(value);

                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      className={`${css.option} ${
                        isSelected ? css.selectedOption : ""
                      }`}
                      onClick={() => handleSelect(option.value)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {isSelected && (
                        <span className={css.checkmark} aria-hidden="true">
                          ✓
                        </span>
                      )}

                      <span>{option.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={css.noResults}>No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

const RecipeFilters = ({
  ingredients = [],
  areas = [],
  selectedIngredient = "",
  selectedArea = "",
  onIngredientChange,
  onAreaChange,
}) => {
  const ingredientOptions = ingredients.map((ingredient) => ({
    value: ingredient.id,
    label: ingredient.name,
  }));

  const areaOptions = areas.map((area) => ({
    value: area.name,
    label: area.name,
  }));

  return (
    <div className={css.filters}>
      <CustomSelect
        placeholder="Ingredients"
        options={ingredientOptions}
        value={selectedIngredient}
        onChange={onIngredientChange}
      />

      <CustomSelect
        placeholder="Area"
        options={areaOptions}
        value={selectedArea}
        onChange={onAreaChange}
      />
    </div>
  );
};

export default RecipeFilters;
