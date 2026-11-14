import "./Pagination.scss";

function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages < 1) return null;

  const getVisiblePages = () => {
    const visibleCount = Math.min(3, totalPages);

    const startPage = Math.max(1, Math.min(currentPage - 1, totalPages - 2));

    return Array.from(
      { length: visibleCount },
      (_, index) => startPage + index,
    );
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      {currentPage > 1 && (
        <button
          type="button"
          className="pagination__button pagination__arrow"
          onClick={() => onPageChange?.(currentPage - 1)}
          aria-label="Previous page"
        >
          &lt;
        </button>
      )}

      {getVisiblePages().map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination__button ${
            currentPage === page ? "pagination__button--active" : ""
          }`}
          onClick={() => onPageChange?.(page)}
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          type="button"
          className="pagination__button pagination__arrow"
          onClick={() => onPageChange?.(currentPage + 1)}
          aria-label="Next page"
        >
          &gt;
        </button>
      )}
    </nav>
  );
}

export default Pagination;
