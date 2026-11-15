
import { useEffect, useRef, useState } from 'react';
import css from './RecipeFilters.module.scss';

const CustomSelect = ({
  placeholder,
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find(
    option => String(option.value) === String(value),
  );

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = optionValue => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={css.selectWrapper} ref={wrapperRef}>
      <button
        type="button"
        className={`${css.select} ${!selectedOption ? css.placeholder : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
      >
        <span>{selectedOption?.label || placeholder}</span>

        <svg
          className={`${css.chevron} ${isOpen ? css.chevronOpen : ''}`}
          aria-hidden="true"
        >
          <use href="/icons.svg#icon-chevron-down" />
        </svg>
      </button>

      {isOpen && (
        <ul className={css.optionsList} role="listbox">
          {options.map(option => {
            const isSelected =
              String(option.value) === String(value);

            return (
              <li key={option.value}>
                <button
                  type="button"
                  className={`${css.option} ${
                    isSelected ? css.selectedOption : ''
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
      )}
    </div>
  );
};

const RecipeFilters = ({
  ingredients = [],
  areas = [],
  selectedIngredient = '',
  selectedArea = '',
  onIngredientChange,
  onAreaChange,
}) => {
  const ingredientOptions = ingredients.map(ingredient => ({
    value: ingredient.id,
    label: ingredient.name,
  }));

  const areaOptions = areas.map(area => ({
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
