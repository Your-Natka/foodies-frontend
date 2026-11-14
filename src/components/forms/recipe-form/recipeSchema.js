import * as Yup from "yup";

export const TITLE_MAX = 255;
export const DESCRIPTION_MAX = 200;
export const INSTRUCTIONS_MAX = 1000;
export const MEASURE_MAX = 100;
export const TIME_MIN = 1;
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

export const recipeSchema = Yup.object({
  photo: Yup.mixed()
    .required("Upload a photo of the dish")
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
    .min(TIME_MIN, `Cooking time must be at least ${TIME_MIN} minute`)
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

export const buildRecipeFormData = (values) => {
  const formData = new FormData();

  formData.append("photo", values.photo);
  formData.append("title", values.title.trim());
  formData.append("description", values.description.trim());
  formData.append("category", values.category);
  formData.append("area", values.area);
  formData.append("time", String(values.time));
  formData.append("instructions", values.instructions.trim());
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
