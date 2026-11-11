import { useState } from "react";
import Section from "../../common/Section/Section";
import CategoryCard from "./CategoryCard";
import "./Categories.scss";

const categories = [
  { id: "beef", title: "Beef", image: "/images/categories/beef.webp" },
  {
    id: "breakfast",
    title: "Breakfast",
    image: "/images/categories/breakfast.webp",
  },
  {
    id: "desserts",
    title: "Desserts",
    image: "/images/categories/desserts.webp",
  },
  { id: "lamb", title: "Lamb", image: "/images/categories/lamb.webp" },
  { id: "goat", title: "Goat", image: "/images/categories/goat.webp" },
  {
    id: "miscellaneous",
    title: "Miscellaneous",
    image: "/images/categories/miscellaneous.webp",
  },
  { id: "pasta", title: "Pasta", image: "/images/categories/pasta.webp" },
  { id: "pork", title: "Pork", image: "/images/categories/pork.webp" },
  { id: "seafood", title: "Seafood", image: "/images/categories/seafood.webp" },
  { id: "side", title: "Side", image: "/images/categories/side.webp" },
  { id: "starter", title: "Starter", image: "/images/categories/starter.webp" },
];

function Categories() {
  const [showAll, setShowAll] = useState(false);

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

      <div
        className={`categories-grid ${
          showAll ? "categories-grid--expanded" : ""
        }`}
      >
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}

        <button
          type="button"
          className="categories-grid__all"
          onClick={() => setShowAll((prev) => !prev)}
          aria-expanded={showAll}
        >
          <span>ALL CATEGORIES</span>
        </button>
      </div>
    </Section>
  );
}

export default Categories;
