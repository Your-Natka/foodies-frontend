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
  }, [interval, testimonials.length]);

  if (!testimonials.length) return null;

  return (
    <div className="testimonial-slider">
      <div className="testimonial-slider__slides">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            text={testimonial.text}
            name={testimonial.name}
            isActive={index === activeIndex}
          />
        ))}
      </div>

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
