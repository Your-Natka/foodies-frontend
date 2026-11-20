import css from "./Spinner.module.scss";

const Spinner = () => {
  return <span className={css.spinner} role="status" aria-label="Loading" />;
};

export default Spinner;
