import { useEffect, useState } from "react";
import Container from "../../common/Container/Container";
import TestimonialSlider from "./TestimonialSlider";
import { getTestimonials } from "../../../services/api/testimonialsApi";
import "./Testimonials.scss";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();

        setTestimonials(
          data.map((item) => ({
            id: item.id,
            text: item.testimonial,
            name: item.owner.name,
          })),
        );
      } catch (error) {
        setError("Failed to load testimonials.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <Container className="testimonials">
      <div className="testimonials__container">
        <p className="testimonials__subtitle">What our customer say</p>
        <h2 className="testimonials__title">Testimonials</h2>

        {loading && <p>Loading testimonials...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <TestimonialSlider testimonials={testimonials} />
        )}
      </div>
    </Container>
  );
}

export default Testimonials;
