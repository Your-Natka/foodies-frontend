
import css from './Pagination.module.scss';

const getVisiblePages = (page, totalPages) => {
  const startPage = Math.min(
    Math.max(page, 1),
    Math.max(totalPages - 2, 1),
  );

  return Array.from(
    { length: Math.min(3, totalPages) },
    (_, index) => startPage + index,
  );
};

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(page, totalPages);

  return (
    <nav className={css.pagination} aria-label="Pagination">
      {pages.map(pageNumber => {
        const isActive = pageNumber === page;

        return (
          <button
            key={pageNumber}
            type="button"
            className={`${css.pageButton} ${isActive ? css.active : ''}`}
            aria-current={isActive ? 'page' : undefined}
            disabled={isActive}
            onClick={() => onPageChange?.(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}
    </nav>
  );
};

export default Pagination;
