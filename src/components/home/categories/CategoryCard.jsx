function CategoryCard({ category }) {
  const handleCategoryClick = () => {
    // Пізніше підключимо перехід до категорії через React Router.
    console.log("Selected category:", category.id);
  };

  const handleRecipeClick = () => {
    // Пізніше підключимо перехід до окремого рецепта.
    console.log("Open recipe from:", category.id);
  };

  return (
    <article className="category-card">
      <img
        className="category-card__image"
        src={category.image}
        alt={category.title}
      />

      <div className="category-card__overlay">
        <button
          type="button"
          className="category-card__name"
          onClick={handleCategoryClick}
        >
          {category.title}
        </button>

        <button
          type="button"
          className="category-card__arrow"
          onClick={handleRecipeClick}
          aria-label={`Open a recipe from ${category.title}`}
        >
          ↗
        </button>
      </div>
    </article>
  );
}

export default CategoryCard;
