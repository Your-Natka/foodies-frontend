import { useState } from "react";
import css from "./FallbackImage.module.scss";

const FallbackImage = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={css.fallbackImage} role="img" aria-label={alt}>
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={css.image}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
};

export default FallbackImage;
