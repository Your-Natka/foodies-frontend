import Container from "../Container/Container";

function Section({
  children,
  className = "",
  containerVariant = "default",
  id,
}) {
  return (
    <section id={id} className={className}>
      <Container variant={containerVariant}>{children}</Container>
    </section>
  );
}

export default Section;
