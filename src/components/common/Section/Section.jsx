import Container from "../Container/Container";

function Section({
  children,
  className = "",
  containerVariant = "default",
  id,
  ...props
}) {
  return (
    <section id={id} className={className} {...props}>
      <Container variant={containerVariant}>{children}</Container>
    </section>
  );
}

export default Section;
