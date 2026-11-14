function CategoryCard({ category }) {
  const handleCategoryClick = () => {
    console.log("Selected category:", category.id);
  };

  const handleRecipeClick = () => {
    console.log("Open recipe from:", category.id);
  };

  return (
    <article className="category-card">
      {category.image && (
        <img
          className="category-card__image"
          src={category.image}
          srcSet={`${category.image2x} 2x`}
          alt={category.title}
          loading="lazy"
        />
      )}

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
