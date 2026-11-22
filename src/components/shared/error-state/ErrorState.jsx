import "./ErrorState.scss";

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the information. Please try again.",
  onRetry,
}) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__icon">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="16"
            cy="16"
            r="13"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M16 9V17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="16" cy="22" r="1.2" fill="currentColor" />
        </svg>
      </div>

      <h2 className="error-state__title">{title}</h2>

      <p className="error-state__message">{message}</p>

      {onRetry && (
        <button type="button" className="error-state__button" onClick={onRetry}>
          TRY AGAIN
        </button>
      )}
    </div>
  );
}

export default ErrorState;
