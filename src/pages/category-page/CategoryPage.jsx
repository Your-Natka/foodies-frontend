import Hero from "../../components/home/hero/Hero";
import CategoryRecipes from "../../components/home/categories/CategoryRecipes";
import Testimonials from "../../components/home/testimonials/Testimonials";

import css from "./CategoryPage.module.scss";

const CategoryPage = () => {
  return (
    <main className={css.categoryPage}>
      <Hero />
      <CategoryRecipes />
      <Testimonials />
    </main>
  );
};

export default CategoryPage;