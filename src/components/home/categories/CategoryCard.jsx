import { useNavigate } from "react-router-dom";

function CategoryCard({ category }) {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/recipes/${category.id}`);
  };

  const handleRecipeClick = () => {
    navigate(`/recipes/${category.id}`);
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
          aria-label={`View recipes in ${category.title}`}
        >
          <svg width="18" height="18" viewBox="0 0 32 32" aria-hidden="true">
            <use href="/images/sprite.svg#icon-arrow-up-right18x18" />
          </svg>
        </button>
      </div>
    </article>
  );
}

export default CategoryCard;
