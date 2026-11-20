import { useDispatch, useSelector } from "react-redux";
import { Link, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import { selectIsAuthenticated } from "../../../redux/slices/auth/authSlice";

import {
  addRecipeIngredients,
  selectIsRecipeInList,
} from "../../../redux/slices/shoppingList/shoppingListSlice";

import css from "./RecipeIngredients.module.scss";

const RecipeIngredients = ({ ingredients = [], recipeId, recipeTitle }) => {
  const dispatch = useDispatch();

  const { onRequireAuth } = useOutletContext();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInList = useSelector(selectIsRecipeInList(recipeId));

  const handleAddToList = () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    dispatch(addRecipeIngredients({ recipeId, recipeTitle, ingredients }));

    toast.success("Ingredients added to your shopping list.");
  };

  return (
    <section className={css.ingredientsSection}>
      <div className={css.header}>
        <h2 className={css.title}>INGREDIENTS</h2>

        {recipeId &&
          ingredients.length > 0 &&
          (isInList ? (
            <Link to="/shopping-list" className={`${css.listButton} no-print`}>
              In shopping list ✓
            </Link>
          ) : (
            <button
              type="button"
              className={`${css.listButton} no-print`}
              onClick={handleAddToList}
            >
              + Add to shopping list
            </button>
          ))}
      </div>

      <ul className={css.ingredientsList}>
        {ingredients.map((ingredient) => (
          <li className={css.ingredient} key={ingredient.id}>
            <div className={css.imageWrapper}>
              <img
                className={css.image}
                src={ingredient.img}
                alt={ingredient.name}
                loading="lazy"
              />
            </div>

            <div className={css.ingredientInfo}>
              <span className={css.name}>{ingredient.name}</span>
              <span className={css.measure}>{ingredient.measure}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecipeIngredients;
