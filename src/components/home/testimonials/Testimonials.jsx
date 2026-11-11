import Container from "../../common/Container/Container";
import TestimonialSlider from "./TestimonialSlider";

import "./Testimonials.scss";

const testimonials = [
  {
    id: "1",
    text: "Thank you for the wonderful recipe for feta pasta with tomatoes and basil. It turned out to be not only tasty, but also incredibly colorful. This has become a favorite family meal!",
    name: "Larry Page",
  },
  {
    id: "2",
    text: "The recipes are easy to follow, delicious and perfect for everyday cooking. I really enjoy trying new dishes!",
    name: "Test User 2",
  },
  {
    id: "3",
    text: "I love discovering new recipes here. The instructions are clear and the results are always wonderful!",
    name: "Test User 3",
  },
];

function Testimonials() {
  return (
    <Container className="testimonials">
      <div className="testimonials__container">
        <p className="testimonials__subtitle">What our customer say</p>
        <h2 className="testimonials__title">Testimonials</h2>
        <TestimonialSlider testimonials={testimonials} />
      </div>
    </Container>
  );
}

export default Testimonials;
