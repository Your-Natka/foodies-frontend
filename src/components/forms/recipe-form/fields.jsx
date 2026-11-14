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

export function PhotoField() {
  const { values, setFieldValue, setFieldTouched } = useFormikContext();
  const inputId = useId();
  const [preview, setPreview] = useState(null);
  const previewUrlRef = useRef("");

  // Shown only while the form still holds the same file (cleared on reset).
  const previewUrl =
    preview && preview.file === values.photo ? preview.url : "";

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

      {previewUrl ? (
        <>
          <label
            htmlFor={inputId}
            className="recipe-form__photo-frame recipe-form__photo-frame--filled"
          >
            <img
              src={previewUrl}
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

export function SelectField({
  name,
  label,
  placeholder,
  options,
  isLoading,
  className = "",
}) {
  const [field, meta] = useField(name);
  const selectId = useId();
  const isInvalid = meta.touched && Boolean(meta.error);

  return (
    <div className={`recipe-form__group ${className}`.trim()}>
      <label htmlFor={selectId} className="recipe-form__label">
        {label}
      </label>
      <div className="recipe-form__select-wrap">
        <select
          {...field}
          id={selectId}
          disabled={isLoading}
          aria-invalid={isInvalid}
          className={`recipe-form__select ${
            field.value ? "" : "recipe-form__select--placeholder"
          }`}
        >
          <option value="" disabled>
            {isLoading ? "Loading..." : placeholder}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.name}>
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
      <FieldError name={name} />
    </div>
  );
}

export function CookingTimeField() {
  const [field, meta, helpers] = useField("time");
  const labelId = useId();
  const value = Number(field.value) || 0;
  const isPristine = !meta.touched && value === meta.initialValue;

  const changeBy = (delta) => {
    helpers.setTouched(true, false);
    helpers.setValue(Math.max(TIME_MIN, value + delta));
  };

  return (
    <div className="recipe-form__group recipe-form__group--time">
      <span className="recipe-form__label" id={labelId}>
        Cooking time
      </span>
      <div
        className="recipe-form__time"
        role="group"
        aria-labelledby={labelId}
      >
        <button
          type="button"
          className="recipe-form__round-button"
          onClick={() => changeBy(-1)}
          disabled={value <= TIME_MIN}
          aria-label="Decrease cooking time"
        >
          <img src={minusIcon} width="24" height="24" alt="" />
        </button>
        <output
          className={`recipe-form__time-value ${
            isPristine ? "recipe-form__time-value--placeholder" : ""
          }`}
          aria-live="polite"
        >
          {value} min
        </output>
        <button
          type="button"
          className="recipe-form__round-button"
          onClick={() => changeBy(1)}
          aria-label="Increase cooking time"
        >
          <img src={plusIcon} width="24" height="24" alt="" />
        </button>
      </div>
      <FieldError name="time" />
    </div>
  );
}
