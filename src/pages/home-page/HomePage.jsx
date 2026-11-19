import { useState } from "react";

import Hero from "../../components/home/hero/Hero";
import Categories from "../../components/home/categories/Categories";
import CategoryRecipes from "../../components/home/categories/CategoryRecipes";
import Testimonials from "../../components/home/testimonials/Testimonials";
import ScrollUp from "../../components/scroll/ScrollUp";
import "./HomePage.scss";

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

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
