import css from "./NotFoundPage.module.scss";

function NotFoundPage() {
  return (
    <section className={css.notFound}>
      <h1>404</h1>
      <p>Page not found.</p>
    </section>
  );
}

export default NotFoundPage;
