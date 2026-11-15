import css from "./LoadingState.module.scss";

const LoadingState = () => {
  return (
    <div className={css.loadingState} role="status" aria-live="polite">
      <span className={css.spinner} aria-hidden="true" />
      <h2 className={css.title}>Loading recipes...</h2>
      <p className={css.description}>
        Please wait while we prepare something delicious for you.
      </p>
    </div>
  );
};

export default LoadingState;