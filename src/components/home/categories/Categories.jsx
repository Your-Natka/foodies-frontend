import { useEffect, useState } from "react";
import Section from "../../common/Section/Section";
import CategoryCard from "./CategoryCard";
import { getCategories } from "../../../services/api/categoriesApi";
import "./Categories.scss";

const DESKTOP_CATEGORIES_COUNT = 11;
const MOBILE_CATEGORIES_COUNT = 8;

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
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches,
  );
  const [visibleCount, setVisibleCount] = useState(() =>
    window.matchMedia("(max-width: 767px)").matches
      ? MOBILE_CATEGORIES_COUNT
      : DESKTOP_CATEGORIES_COUNT,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Визначаємо зміну між мобільною та планшетною/десктопною версіями
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleScreenChange = (event) => {
      setIsMobile(event.matches);
      setVisibleCount(
        event.matches ? MOBILE_CATEGORIES_COUNT : DESKTOP_CATEGORIES_COUNT,
      );
    };

    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  // Завантажуємо категорії з Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();

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

  const initialCount = isMobile
    ? MOBILE_CATEGORIES_COUNT
    : DESKTOP_CATEGORIES_COUNT;

  const visibleCategories = categories.slice(0, visibleCount);
  const hasMoreCategories = visibleCount < categories.length;

  const handleLoadMore = () => {
    setVisibleCount((currentCount) =>
      Math.min(currentCount + initialCount, categories.length),
    );
  };

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

          {hasMoreCategories && (
            <button
              type="button"
              className="categories-grid__all"
              onClick={handleLoadMore}
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
