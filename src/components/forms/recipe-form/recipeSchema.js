
import * as Yup from "yup";

export const TITLE_MAX = 255;
export const DESCRIPTION_MAX = 200;
export const INSTRUCTIONS_MAX = 1000;
export const MEASURE_MAX = 100;
export const TIME_MIN = 10;
export const TIME_DEFAULT = 10;

export const PHOTO_MAX_SIZE = 5 * 1024 * 1024;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const initialValues = {
  photo: null,
  title: "",
  description: "",
  category: "",
  time: TIME_DEFAULT,
  area: "",
  ingredients: [],
  instructions: "",
};

// Shared validation rules for creating and editing recipes.
const baseRecipeSchema = Yup.object({
  photo: Yup.mixed()
    .nullable()
    .test(
      "photo-type",
      "Use a JPEG, PNG or WebP image",
      (file) => !file || PHOTO_TYPES.includes(file.type),
    )
    .test(
      "photo-size",
      "Photo must not exceed 5 MB",
      (file) => !file || file.size <= PHOTO_MAX_SIZE,
    ),

  title: Yup.string()
    .trim()
    .max(TITLE_MAX, `Name must be at most ${TITLE_MAX} characters`)
    .required("Enter the name of the recipe"),

  description: Yup.string()
    .trim()
    .max(
      DESCRIPTION_MAX,
      `Description must be at most ${DESCRIPTION_MAX} characters`,
    )
    .required("Enter a description of the dish"),

  category: Yup.string().required("Select a category"),

  time: Yup.number()
    .typeError("Enter the cooking time")
    .integer("Cooking time must be a whole number of minutes")
    .min(TIME_MIN, `Cooking time must be at least ${TIME_MIN} minutes`)
    .required("Enter the cooking time"),

  area: Yup.string().required("Select an area"),

  ingredients: Yup.array()
    .of(
      Yup.object({
        id: Yup.string().required(),
        measure: Yup.string().trim().max(MEASURE_MAX).required(),
      }),
    )
    .min(1, "Add at least one ingredient"),

  instructions: Yup.string()
    .trim()
    .max(
      INSTRUCTIONS_MAX,
      `Recipe must be at most ${INSTRUCTIONS_MAX} characters`,
    )
    .required("Enter the recipe preparation"),
});

// photo is required when creating a recipe
export const recipeSchema = baseRecipeSchema.shape({
  photo: baseRecipeSchema.fields.photo.required(
    "Upload a photo of the dish",
  ),
});

// existing photo can be kept when editing a recipe
export const editRecipeSchema = baseRecipeSchema;

// convert an existing recipe into Formik initial values
export const getRecipeInitialValues = (recipe) => ({
  photo: null,
  title: recipe.title ?? "",
  description: recipe.description ?? "",
  category: recipe.category ?? "",
  time: Number(recipe.time) || TIME_DEFAULT,
  area: recipe.area ?? "",
  ingredients: (recipe.ingredients ?? []).map((ingredient) => ({
    id: ingredient.id,
    measure: ingredient.measure,
  })),
  instructions: recipe.instructions ?? "",
});

// build multipart form data for creating or updating a recipe
export const buildRecipeFormData = (values) => {
  const formData = new FormData();

  if (values.photo) {
    formData.append("photo", values.photo);
  }

  formData.append("title", values.title.trim());
  formData.append("description", values.description.trim());
  formData.append("category", values.category);
  formData.append("area", values.area);
  formData.append("time", String(values.time));
  formData.append(
    "instructions",
    values.instructions
      .trim()
      .replace(/\r\n/g, "\n")
  );

  formData.append(
    "ingredients",
    JSON.stringify(
      values.ingredients.map(({ id, measure }) => ({
        ingredientId: id,
        measure,
      })),
    ),
  );

  return formData;
};
