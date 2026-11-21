import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ErrorMessage, useField, useFormikContext } from "formik";

import captureIcon from "../../../assets/icons/add-recipe/capture.svg";
import cameraIcon from "../../../assets/icons/add-recipe/photo-camera.svg";
import chevronIcon from "../../../assets/icons/add-recipe/chevron-down.svg";
import minusIcon from "../../../assets/icons/add-recipe/minus.svg";
import plusIcon from "../../../assets/icons/add-recipe/plus.svg";

import { PHOTO_TYPES, TIME_MIN } from "./recipeSchema";

export function FieldError({ name }) {
  return (
    <ErrorMessage
      name={name}
      render={(message) =>
        typeof message === "string" ? (
          <p className="recipe-form__error" role="alert">
            {message}
          </p>
        ) : null
      }
    />
  );
}

export function PhotoField({ initialPhoto }) {
  const { values, setFieldValue, setFieldTouched } = useFormikContext();
  const inputId = useId();
  const [preview, setPreview] = useState(null);
  const previewUrlRef = useRef("");

  // Shown only while the form still holds the same file (cleared on reset).
  const previewUrl =
    preview && preview.file === values.photo ? preview.url : "";

  // Show the newly selected photo or the saved recipe photo.
  const photoUrl = previewUrl || initialPhoto;

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  const handleChange = (event) => {
    const file = event.currentTarget.files?.[0];

    // Allow picking the same file again after a reset.
    event.currentTarget.value = "";

    if (!file) return;

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

    const url = PHOTO_TYPES.includes(file.type)
      ? URL.createObjectURL(file)
      : "";

    previewUrlRef.current = url;
    setPreview({ file, url });

    setFieldTouched("photo", true, false);
    setFieldValue("photo", file);
  };

  return (
    <div className="recipe-form__photo">
      <input
        id={inputId}
        type="file"
        name="photo"
        accept={PHOTO_TYPES.join(",")}
        className="recipe-form__photo-input"
        onChange={handleChange}
      />

      {photoUrl ? (
        <>
          <label
            htmlFor={inputId}
            className="recipe-form__photo-frame recipe-form__photo-frame--filled"
          >
            <img
              src={photoUrl}
              alt="Recipe preview"
              className="recipe-form__photo-preview"
            />
          </label>

          <label htmlFor={inputId} className="recipe-form__photo-link">
            Upload another photo
          </label>
        </>
      ) : (
        <label htmlFor={inputId} className="recipe-form__photo-frame">
          <span className="recipe-form__photo-icon" aria-hidden="true">
            <img src={captureIcon} width="64" height="64" alt="" />
            <img
              src={cameraIcon}
              width="24"
              height="24"
              alt=""
              className="recipe-form__photo-camera"
            />
          </span>

          <span className="recipe-form__photo-link">Upload a photo</span>
        </label>
      )}

      <FieldError name="photo" />
    </div>
  );
}

export function CountedTextarea({ name, placeholder, maxLength }) {
  const [field, meta] = useField(name);
  const textareaRef = useRef(null);
  const length = field.value.length;
  const isInvalid = meta.touched && Boolean(meta.error);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [field.value]);

  return (
    <div className="recipe-form__field">
      <div
        className={`recipe-form__textarea-wrap ${
          isInvalid ? "recipe-form__textarea-wrap--invalid" : ""
        }`}
      >
        <textarea
          {...field}
          ref={textareaRef}
          rows={1}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-invalid={isInvalid}
          className="recipe-form__textarea"
        />
        <span className="recipe-form__counter">
          <span
            className={
              length > maxLength
                ? "recipe-form__counter-value recipe-form__counter-value--over"
                : length > 0
                  ? "recipe-form__counter-value"
                  : ""
            }
          >
            {length}
          </span>
          /{maxLength}
        </span>
      </div>
      <FieldError name={name} />
    </div>
  );
}

export function SearchableSelect({
  id,
  value,
  options = [],
  placeholder,
  isLoading = false,
  isInvalid = false,
  disabledValues = [],
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().startsWith(normalizedSearch),
  );

  const selectedOption = options.find(
    (option) => String(option.value) === String(value),
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
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
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (isLoading) return;

    setSearch("");
    setIsOpen((previous) => !previous);
  };

  const handleSelect = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="recipe-form__search-select-wrap" ref={wrapperRef}>
      <button
        id={id}
        type="button"
        className={`recipe-form__select ${
          !selectedOption ? "recipe-form__select--placeholder" : ""
        }`}
        onClick={handleToggle}
        disabled={isLoading}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={isInvalid}
      >
        <span>
          {isLoading ? "Loading..." : selectedOption?.label || placeholder}
        </span>

        <img
          src={chevronIcon}
          width="18"
          height="18"
          alt=""
          className={`recipe-form__select-icon ${
            isOpen ? "recipe-form__select-icon--open" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="recipe-form__dropdown">
          <input
            ref={searchInputRef}
            type="text"
            className="recipe-form__search-input"
            placeholder="Type to search..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label={`Search ${placeholder}`}
            autoComplete="off"
            style={{ color: "var(--color-black)" }}
          />

          {filteredOptions.length > 0 ? (
            <ul className="recipe-form__options-list" role="listbox">
              {filteredOptions.map((option) => {
                const isSelected = String(option.value) === String(value);

                const isDisabled = disabledValues.some(
                  (item) => String(item) === String(option.value),
                );

                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      className={`recipe-form__option ${
                        isSelected ? "recipe-form__option--selected" : ""
                      }`}
                      disabled={isDisabled}
                      onClick={() => handleSelect(option.value)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {option.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="recipe-form__no-results">No results found</p>
          )}
        </div>
      )}
    </div>
  );
}

export function SelectField({
  name,
  label,
  placeholder,
  options,
  isLoading,
  className = "",
}) {
  const [field, meta, helpers] = useField(name);
  const selectId = useId();
  const isInvalid = meta.touched && Boolean(meta.error);

  const selectOptions = options.map((option) => ({
    value: option.name,
    label: option.name,
  }));

  return (
    <div className={`recipe-form__group ${className}`.trim()}>
      <label htmlFor={selectId} className="recipe-form__label">
        {label}
      </label>

      <SearchableSelect
        id={selectId}
        value={field.value}
        options={selectOptions}
        placeholder={placeholder}
        isLoading={isLoading}
        isInvalid={isInvalid}
        onChange={(value) => {
          helpers.setValue(value);
          helpers.setTouched(true, false);
        }}
      />

      <FieldError name={name} />
    </div>
  );
}

// converts minutes into a readable cooking time
function formatCookingTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) return `${hours}h ${minutes}min`;
  if (hours) return `${hours} h`;

  return `${minutes} min`;
}

function parseCookingTime(input) {
  const value = input.trim().toLowerCase().replace(/\s+/g, "");

  const minutesMatch = value.match(/^(\d+)min$/);
  if (minutesMatch) {
    return Number(minutesMatch[1]);
  }

  const hoursMatch = value.match(/^(\d+)h(?:(\d+)m(?:in)?)?$/);
  if (hoursMatch) {
    return Number(hoursMatch[1]) * 60 + Number(hoursMatch[2] || 0);
  }

  return null;
}

export function CookingTimeField() {
  const [field, meta, helpers] = useField("time");
  const labelId = useId();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const value = Number(field.value) || TIME_MIN;

  const changeBy = (delta) => {
    // prevent decreasing below the minimum.
    if (delta < 0 && value <= TIME_MIN) return;

    const nextValue = Math.max(TIME_MIN, value + delta);

    helpers.setValue(nextValue, true);
    helpers.setTouched(true, false);
  };

  const isPristine = !meta.touched && value === meta.initialValue;
  const isMinValue = value <= TIME_MIN;

  const startEditing = () => {
    setDraft(formatCookingTime(value));
    setIsEditing(true);
  };

  const finishEditing = async () => {
    const parsedValue = parseCookingTime(draft);

    if (parsedValue !== null) {
      await helpers.setValue(parsedValue, true);
      await helpers.setTouched(true, false);
    }

    setIsEditing(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setDraft("");
  };

  return (
    <div className="recipe-form__group recipe-form__group--time">
      <span className="recipe-form__label" id={labelId}>
        Cooking time
      </span>

      <div className="recipe-form__time" role="group" aria-labelledby={labelId}>
        <button
          type="button"
          className="recipe-form__round-button"
          onClick={() => changeBy(-5)}
          disabled={isMinValue}
          aria-label="Decrease cooking time"
        >
          <img src={minusIcon} width="24" height="24" alt="" />
        </button>

        {isEditing ? (
          <div className="recipe-form__time-edit-wrap">
            <input
              type="text"
              className="recipe-form__time-edit"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={finishEditing}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }

                if (event.key === "Escape") {
                  cancelEditing();
                }
              }}
              aria-label="Enter cooking time"
              autoFocus
            />

            <p className="recipe-form__time-hint">Examples: 105min or 1h 45m</p>
          </div>
        ) : (
          <button
            type="button"
            translate="no"
            className={`recipe-form__time-value ${
              isPristine ? "recipe-form__time-value--placeholder" : ""
            }`}
            onClick={startEditing}
            aria-label={`Edit cooking time: ${formatCookingTime(value)}`}
            title="Click to edit cooking time"
          >
            {formatCookingTime(value)}
          </button>
        )}

        <button
          type="button"
          className="recipe-form__round-button"
          onClick={() => changeBy(5)}
          aria-label="Increase cooking time"
        >
          <img src={plusIcon} width="24" height="24" alt="" />
        </button>
      </div>

      <FieldError name="time" />
    </div>
  );
}
