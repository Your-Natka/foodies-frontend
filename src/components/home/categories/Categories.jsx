import { useEffect, useState } from "react";
import Section from "../../common/Section/Section";
import CategoryCard from "./CategoryCard";
import { getCategories } from "../../../services/api/categoriesApi";
import "./Categories.scss";

const INITIAL_CATEGORIES_COUNT = 11;

const categoryImages = {
  Beef: "Beef",
  Breakfast: "Breakfast",
  Chicken: "Chicken",
  Dessert: "Desserts",
  Desserts: "Desserts",
  Goat: "Goat",
  Lamb: "Lamb",
  Miscellaneous: "Miscellaneous",
  Pasta: "Pasta",
  Pork: "Pork",
  Seafood: "Seafood",
  Side: "Side",
  Soup: "Soup",
  Starter: "Starter",
  Vegan: "Vegan",
  Vegetarian: "Vegetarian",
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        console.log("Categories from API:", data);
        console.log("Image mapping:", categoryImages);

        setCategories(
          data.map((category) => {
            const imageName = categoryImages[category.name];

            if (!imageName) {
              console.warn("Image not found for category:", category.name);
            }

            return {
              id: category.id,
              title: category.name,
              image: imageName
                ? `/images/categories/${imageName}@1.webp`
                : null,
              image2x: imageName
                ? `/images/categories/${imageName}@2.webp`
                : null,
            };
          }),
        );
      } catch {
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const visibleCategories = showAll
    ? categories
    : categories.slice(0, INITIAL_CATEGORIES_COUNT);

  return (
    <Section className="categories-section" id="categories">
      <div className="categories-section__heading">
        <h2 className="categories-section__title">Categories</h2>
        <p className="categories-section__description">
          Discover a limitless world of culinary possibilities and enjoy
          exquisite recipes that combine taste, style and the warm atmosphere of
          the kitchen.
        </p>
      </div>

      {loading && <p>Loading categories...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="categories-grid">
          {visibleCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}

          {!showAll && categories.length > INITIAL_CATEGORIES_COUNT && (
            <button
              type="button"
              className="categories-grid__all"
              onClick={() => setShowAll(true)}
            >
              <span>ALL CATEGORIES</span>
            </button>
          )}
        </div>
      )}
    </Section>
  );
}

export default Categories;
