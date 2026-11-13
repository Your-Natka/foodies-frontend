
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import CategoryInfo from '../../components/recipes/category-info/CategoryInfo';
import RecipeFilters from '../../components/recipes/recipe-filters/RecipeFilters';
import RecipeList from '../../components/recipes/recipe-list/RecipeList';
import Pagination from '../../components/shared/pagination/Pagination';

import {
  selectIngredients,
} from '../../redux/slices/ingredients/ingredientsSlice';

import {
  selectAreas,
} from '../../redux/slices/areas/areasSlice';

import {
  setRecipesPage,
  selectRecipes,
  selectRecipesStatus,
  selectRecipesError,
  selectRecipesPage,
  selectRecipesTotalPages,
} from '../../redux/slices/recipes/recipesSlice';

import {
  fetchRecipesThunk,
} from '../../redux/slices/recipes/recipesOperations';

import {
  fetchIngredientsThunk,
} from '../../redux/slices/ingredients/ingredientsOperations';

import {
  fetchAreasThunk,
} from '../../redux/slices/areas/areasOperations';

import css from './CategoryPage.module.scss';

const CategoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category } = useParams();

  const recipes = useSelector(selectRecipes);
  const status = useSelector(selectRecipesStatus);
  const error = useSelector(selectRecipesError);
  const page = useSelector(selectRecipesPage);
  const totalPages = useSelector(selectRecipesTotalPages);

  const ingredients = useSelector(selectIngredients);
  const areas = useSelector(selectAreas);

  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  // Reset pagination and filters when category changes
  useEffect(() => {
    dispatch(setRecipesPage(1));
    setSelectedIngredient('');
    setSelectedArea('');
  }, [dispatch, category]);

  // Load ingredients and areas
  useEffect(() => {
    dispatch(fetchIngredientsThunk());
    dispatch(fetchAreasThunk());
  }, [dispatch]);

  // Load recipes
  useEffect(() => {
    dispatch(
      fetchRecipesThunk({
        page,
        limit: 9,
        category: category || undefined,
        ingredientId: selectedIngredient || undefined,
        area: selectedArea || undefined,
      }),
    );
  }, [dispatch, page, category, selectedIngredient, selectedArea]);

  const handlePageChange = nextPage => {
    dispatch(setRecipesPage(nextPage));
  };

  const handleIngredientChange = value => {
    setSelectedIngredient(value);
    dispatch(setRecipesPage(1));
  };

  const handleAreaChange = value => {
    setSelectedArea(value);
    dispatch(setRecipesPage(1));
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <main className={css.categoryPage}>
      <div className="container">
        <button type="button" onClick={handleBack}>
          Back
        </button>

        <CategoryInfo
          title={category || 'All Categories'}
          description="Discover a limitless world of culinary possibilities and enjoy exquisite recipes for every taste."
        />

        <div className={css.catalog}>
          <aside className={css.sidebar}>
            <RecipeFilters
              ingredients={ingredients}
              areas={areas}
              selectedIngredient={selectedIngredient}
              selectedArea={selectedArea}
              onIngredientChange={handleIngredientChange}
              onAreaChange={handleAreaChange}
            />
          </aside>

          <div className={css.content}>
            {status === 'loading' && (
              <p>Loading recipes...</p>
            )}

            {status === 'failed' && (
              <p>
                {error || 'Something went wrong. Please try again.'}
              </p>
            )}

            {status === 'succeeded' && recipes.length === 0 && (
              <p>No recipes found.</p>
            )}

            {status === 'succeeded' && recipes.length > 0 && (
              <RecipeList recipes={recipes} />
            )}

            {status === 'succeeded' && totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
