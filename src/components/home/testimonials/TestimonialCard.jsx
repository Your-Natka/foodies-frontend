function TestimonialCard({ text, name }) {
  return (
    <article className="testimonial-card">
      <svg
        className="testimonial-card__quote"
        viewBox="0 0 39 32"
        aria-hidden="true"
      >
        <use href="/images/sprite.svg#icon-untitled" />
      </svg>

      <p className="testimonial-card__text">{text}</p>

      <p className="testimonial-card__author">{name}</p>
    </article>
  );
}

export default TestimonialCard;
