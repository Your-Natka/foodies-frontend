function Container({ children, variant = "default", className = "" }) {
  const containerClass = variant === "hero" ? "hero-container" : "container";

  return (
    <div className={`${containerClass} ${className}`.trim()}>{children}</div>
  );
}

export default Container;
