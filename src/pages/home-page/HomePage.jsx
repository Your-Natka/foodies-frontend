import Hero from "../../components/home/hero/Hero";
import Categories from "../../components/home/categories/Categories";
import Testimonials from "../../components/home/testimonials/Testimonials";

function HomePage() {
  return (
    <main className="home-page">
      <Hero />
      <Categories />
      <Testimonials />
    </main>
  );
}

export default HomePage;
