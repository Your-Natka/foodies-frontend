import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import trashIcon from "../../../assets/icons/add-recipe/trash.svg";

import { getCategories } from "../../../services/api/categoriesApi";
import { getAreas } from "../../../services/api/areasApi";
import { getIngredients } from "../../../services/api/ingredientsApi";
import { createRecipe } from "../../../services/api/recipesApi";

import {
  CookingTimeField,
  CountedTextarea,
  FieldError,
  PhotoField,
  SelectField,
} from "./fields";
import IngredientsField from "./IngredientsField";
import {
  DESCRIPTION_MAX,
  INSTRUCTIONS_MAX,
  buildRecipeFormData,
  initialValues,
  recipeSchema,
} from "./recipeSchema";

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

  return { ...data, isLoading: status === "loading", isError: status === "error" };
}

function RecipeForm() {
  const navigate = useNavigate();
  const { categories, areas, ingredients, isLoading, isError } =
    useRecipeReferenceData();

  // Remounts the ingredient picker so its draft row is cleared on reset.
  const [resetCount, setResetCount] = useState(0);

  const handleSubmit = async (values, { setFieldError }) => {
    try {
      const recipe = await createRecipe(buildRecipeFormData(values));

      toast.success("Recipe published!");
      navigate(`/recipe/${recipe.id}`);
    } catch (error) {
      const data = error.response?.data;

      data?.errors?.forEach(({ field, message }) => {
        const name = field?.split(".")[0];

        if (name && name in initialValues) {
          setFieldError(name, message);
        }
      });

      toast.error(
        data?.message || "Failed to publish the recipe. Please try again.",
      );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={recipeSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, resetForm }) => (
        <Form className="recipe-form" noValidate>
          <PhotoField />

          <div className="recipe-form__body">
            {isError && (
              <p className="recipe-form__notice" role="alert">
                Failed to load categories, areas or ingredients. Refresh the
                page to try again.
              </p>
            )}

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
                  resetForm();
                  setResetCount((count) => count + 1);
                }}
                disabled={isSubmitting}
                aria-label="Clear the form"
              >
                <img src={trashIcon} width="20" height="20" alt="" />
              </button>
              <button
                type="submit"
                className="recipe-form__submit"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default RecipeForm;
