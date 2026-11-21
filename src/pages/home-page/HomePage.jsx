import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Hero from "../../components/home/hero/Hero";
import Categories from "../../components/home/categories/Categories";
import CategoryRecipes from "../../components/home/categories/CategoryRecipes";
import Testimonials from "../../components/home/testimonials/Testimonials";
import ScrollUp from "../../components/scroll/ScrollUp";
import "./HomePage.scss";

function HomePage() {
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState(
    () => location.state?.selectedCategory ?? null,
  );

  useEffect(() => {
    if (location.hash !== "#categories" || selectedCategory) return;

    requestAnimationFrame(() => {
      document.getElementById("categories")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [location.hash, selectedCategory]);

  return (
    <main className="home-page">
      <Hero />

      {selectedCategory ? (
        <CategoryRecipes
          categoryName={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      ) : (
        <Categories onSelectCategory={setSelectedCategory} />
      )}

      <Testimonials />
      <ScrollUp />
    </main>
  );
}

export default HomePage;
