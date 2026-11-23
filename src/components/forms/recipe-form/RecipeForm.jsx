import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import trashIcon from "../../../assets/icons/add-recipe/trash.svg";

import Loader from "../../shared/Loader/Loader";
import { getCategories } from "../../../services/api/categoriesApi";
import { getAreas } from "../../../services/api/areasApi";
import { getIngredients } from "../../../services/api/ingredientsApi";
import {
  createRecipe,
  updateRecipe,
  getRecipeById,
} from "../../../services/api/recipesApi";

import {
  CookingTimeField,
  CountedTextarea,
  FieldError,
  PhotoField,
  SelectField,
} from "./fields";

import IngredientsField from "./IngredientsField";

import {
  DraftAutosave,
  clearRecipeDraft,
  loadRecipeDraft,
} from "./recipeDraft";

import {
  DESCRIPTION_MAX,
  INSTRUCTIONS_MAX,
  buildRecipeFormData,
  initialValues,
  recipeSchema,
  editRecipeSchema,
  getRecipeInitialValues,
} from "./recipeSchema";

import ScrollToFirstError from "./ScrollToFirstError";

import "./RecipeForm.scss";

const sortByName = (items = []) =>
  [...items].sort((a, b) => a.name.localeCompare(b.name));

function useRecipeReferenceData() {
  const [data, setData] = useState({
    categories: [],
    areas: [],
    ingredients: [],
  });

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let ignore = false;

    Promise.all([getCategories(), getAreas(), getIngredients()])
      .then(([categories, areas, ingredients]) => {
        if (ignore) return;

        setData({
          categories: sortByName(categories),
          areas: sortByName(areas),
          ingredients: sortByName(ingredients),
        });

        setStatus("success");
      })
      .catch(() => {
        if (ignore) return;

        setStatus("error");
        toast.error("Failed to load categories, areas or ingredients.");
      });

    return () => {
      ignore = true;
    };
  }, []);

  return {
    ...data,
    isLoading: status === "loading",
    isError: status === "error",
  };
}

function RecipeForm({ recipeId }) {
  const navigate = useNavigate();

  const { categories, areas, ingredients, isLoading, isError } =
    useRecipeReferenceData();

  const isEditMode = Boolean(recipeId);

  const [resetCount, setResetCount] = useState(0);

  const [savedDraft] = useState(() => (isEditMode ? null : loadRecipeDraft()));

  const [recipe, setRecipe] = useState(null);
  const [isRecipeLoading, setIsRecipeLoading] = useState(isEditMode);
  const [recipeError, setRecipeError] = useState(false);

  // Load the existing recipe in edit mode.
  useEffect(() => {
    if (!isEditMode) return;

    let ignore = false;

    const loadRecipe = async () => {
      try {
        setIsRecipeLoading(true);
        setRecipeError(false);
        setRecipe(null);

        const response = await getRecipeById(recipeId);
        const recipeData = response.data ?? response;

        if (!ignore) {
          setRecipe(recipeData);
        }
      } catch {
        if (!ignore) {
          setRecipeError(true);
          toast.error("Failed to load the recipe.");
        }
      } finally {
        if (!ignore) {
          setIsRecipeLoading(false);
        }
      }
    };

    loadRecipe();

    return () => {
      ignore = true;
    };
  }, [recipeId, isEditMode]);

  useEffect(() => {
    if (savedDraft && !isEditMode) {
      toast.info("Draft restored. Don't forget to add the photo again.", {
        toastId: "recipe-draft-restored",
      });
    }
  }, [savedDraft, isEditMode]);

  const handleSubmit = async (values, { setFieldError }) => {
    try {
      const formData = buildRecipeFormData(values);

      let result;

      if (isEditMode) {
        result = await updateRecipe(recipeId, formData);

        toast.success("Recipe updated!");
      } else {
        result = await createRecipe(formData);

        clearRecipeDraft();

        toast.success("Recipe published!");
      }

      navigate(`/recipe/${result.id ?? recipeId}`);
    } catch (error) {
      const data = error.response?.data;

      data?.errors?.forEach(({ field, message }) => {
        const name = field?.split(".")[0];

        if (name && name in initialValues) {
          setFieldError(name, message);
        }
      });

      toast.error(
        data?.message ||
          `Failed to ${isEditMode ? "update" : "publish"} the recipe. Please try again.`,
      );
    }
  };

  if (isEditMode && isRecipeLoading) {
    return <Loader text="Loading recipe..." />;
  }

  if (isEditMode && (recipeError || !recipe)) {
    return (
      <p className="recipe-form__notice" role="alert">
        Failed to load the recipe. Please try again.
      </p>
    );
  }

  const formInitialValues = isEditMode
    ? getRecipeInitialValues(recipe)
    : (savedDraft ?? initialValues);

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={isEditMode ? editRecipeSchema : recipeSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, resetForm }) => (
        <Form className="recipe-form" noValidate>
          <ScrollToFirstError />

          {!isEditMode && <DraftAutosave />}

          <PhotoField initialPhoto={recipe?.thumb} />

          <div className="recipe-form__body">
            <div className="recipe-form__main">
              <div className="recipe-form__fields">
                <div className="recipe-form__name">
                  <div className="recipe-form__field">
                    <Field
                      type="text"
                      name="title"
                      placeholder="The name of the recipe"
                      aria-label="The name of the recipe"
                      className="recipe-form__title-input"
                    />
                    <FieldError name="title" />
                  </div>

                  <CountedTextarea
                    name="description"
                    placeholder="Enter a description of the dish"
                    maxLength={DESCRIPTION_MAX}
                  />
                </div>

                <div className="recipe-form__row">
                  <SelectField
                    name="category"
                    label="Category"
                    placeholder="Select a category"
                    options={categories}
                    isLoading={isLoading}
                    className="recipe-form__group--category"
                  />

                  <CookingTimeField />
                </div>

                <SelectField
                  name="area"
                  label="Area"
                  placeholder="Area"
                  options={areas}
                  isLoading={isLoading}
                  className="recipe-form__group--area"
                />
              </div>

              <IngredientsField
                key={resetCount}
                options={ingredients}
                isLoading={isLoading}
              />
            </div>

            <div className="recipe-form__preparation">
              <h2 className="recipe-form__label recipe-form__label--section">
                Recipe Preparation
              </h2>

              <CountedTextarea
                name="instructions"
                placeholder="Enter recipe"
                maxLength={INSTRUCTIONS_MAX}
              />
            </div>

            <div className="recipe-form__actions">
              <button
                type="button"
                className="recipe-form__round-button recipe-form__reset"
                onClick={() => {
                  if (!isEditMode) {
                    clearRecipeDraft();
                    resetForm({ values: initialValues });
                  } else {
                    resetForm({
                      values: getRecipeInitialValues(recipe),
                    });
                  }

                  setResetCount((count) => count + 1);
                }}
                disabled={isSubmitting}
                aria-label={isEditMode ? "Reset changes" : "Clear the form"}
              >
                <img src={trashIcon} width="20" height="20" alt="" />
              </button>

              <button
                type="submit"
                className="recipe-form__submit"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Publishing..."
                  : isEditMode
                    ? "Update"
                    : "Publish"}
              </button>

              {isEditMode && (
                <button
                  type="button"
                  className="recipe-form__cancel"
                  onClick={() => navigate(`/recipe/${recipeId}`)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default RecipeForm;
