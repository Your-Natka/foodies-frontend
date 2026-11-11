import { useEffect, useState } from "react";
import TestimonialCard from "./TestimonialCard";

function TestimonialSlider({ testimonials, interval = 5000 }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex(
        (currentIndex) => (currentIndex + 1) % testimonials.length,
      );
    }, interval);

    return () => clearInterval(timer);
  }, [activeIndex, interval, testimonials.length]);

  if (!testimonials.length) return null;

  const activeTestimonial = testimonials[activeIndex];

  return (
    <div className="testimonial-slider">
      <TestimonialCard
        text={activeTestimonial.text}
        name={activeTestimonial.name}
      />

      <div className="testimonial-slider__pagination">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.id}
            type="button"
            className={`testimonial-slider__dot ${
              index === activeIndex ? "testimonial-slider__dot--active" : ""
            }`}
            aria-label={`Показати відгук ${index + 1}`}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default TestimonialSlider;
