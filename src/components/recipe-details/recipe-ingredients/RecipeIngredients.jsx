import css from './RecipeIngredients.module.scss';

const RecipeIngredients = ({ ingredients = [] }) => {
  return (
    <section className={css.ingredientsSection}>
      <h3 className={css.title}>INGREDIENTS</h3>

      <ul className={css.ingredientsList}>
        {ingredients.map(ingredient => (
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