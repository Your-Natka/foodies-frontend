import { useEffect, useRef, useState } from "react";
import css from "./RecipeFilters.module.scss";

const CustomSelect = ({ placeholder, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const optionsListRef = useRef(null);
  const optionRefs = useRef(new Map());

  const selectedOption = options.find(
    (option) => String(option.value) === String(value),
  );

  const normalizedSearch = search.trim().toLowerCase();

  const matchingIndex = normalizedSearch
    ? options.findIndex((option) =>
        option.label.toLowerCase().startsWith(normalizedSearch),
      )
    : -1;

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

  // Прокручуємо повний список до першого відповідного елемента.
  useEffect(() => {
    if (!isOpen || !normalizedSearch || matchingIndex === -1) {
      return;
    }

    const list = optionsListRef.current;
    const option = optionRefs.current.get(String(options[matchingIndex].value));

    if (!list || !option) {
      return;
    }

    const listRect = list.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();

    const scrollPosition = list.scrollTop + optionRect.top - listRect.top;

    list.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  }, [isOpen, normalizedSearch, matchingIndex, options]);

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

          {normalizedSearch && matchingIndex === -1 && (
            <p className={css.noResults}>No results found</p>
          )}

          <ul ref={optionsListRef} className={css.optionsList} role="listbox">
            {options.map((option, index) => {
              const isSelected = String(option.value) === String(value);

              return (
                <li
                  key={option.value}
                  ref={(element) => {
                    const key = String(option.value);

                    if (element) {
                      optionRefs.current.set(key, element);
                    } else {
                      optionRefs.current.delete(key);
                    }
                  }}
                >
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