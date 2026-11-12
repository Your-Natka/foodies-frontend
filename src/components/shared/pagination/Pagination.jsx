import css from './Pagination.module.scss';

const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    const pages = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );

    return (
        <nav className={css.pagination} aria-label="Pagination">
            {pages.map(pageNumber => {
                const isActive = pageNumber === page;

                return (
                    <button
                        key={pageNumber}
                        type="button"
                        className={`${css.pageButton} ${
                            isActive ? css.active : ''
                        }`}
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