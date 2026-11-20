import { useParams } from "react-router-dom";
import Hero from "../../components/home/hero/Hero";
import CategoryRecipes from "../../components/home/categories/CategoryRecipes";
import Testimonials from "../../components/home/testimonials/Testimonials";

import css from "./CategoryPage.module.scss";

const CategoryPage = () => {
  const { category } = useParams();

  return (
    <main className={css.categoryPage}>
      <Hero />
      <CategoryRecipes categoryName={category} />
      <Testimonials />
    </main>
  );
};

export default CategoryPage;
