
import { useState } from 'react';

import CategoryInfo from '../../components/recipes/category-info/CategoryInfo';
import RecipeFilters from '../../components/recipes/recipe-filters/RecipeFilters';
import RecipeList from '../../components/recipes/recipe-list/RecipeList';
import Pagination from '../../components/shared/pagination/Pagination';

import css from './CategoryPage.module.scss';

const CategoryPage = () => {
    const [page, setPage] = useState(1);

    const totalPages = 3;

    const handlePageChange = (nextPage) => {
        setPage(nextPage);
    };

    return (
        <main className={css.categoryPage}>
            <div className="container">
                <CategoryInfo
                    title="Desserts"
                    description="Discover a limitless world of culinary possibilities and enjoy exquisite dessert recipes that combine taste, style and the warm atmosphere of the kitchen."
                />

                <div className={css.catalog}>
                    <aside className={css.sidebar}>
                        <RecipeFilters />
                    </aside>

                    <div className={css.content}>
                        <RecipeList />

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CategoryPage;
