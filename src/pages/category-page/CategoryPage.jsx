
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Hero from '../../components/home/hero/Hero';
import Testimonials from '../../components/home/testimonials/Testimonials';

import CategoryInfo from '../../components/recipes/category-info/CategoryInfo';
import RecipeFilters from '../../components/recipes/recipe-filters/RecipeFilters';
import RecipeList from '../../components/recipes/recipe-list/RecipeList';
import Pagination from '../../components/shared/pagination/Pagination';

import SignInModal from '../../components/auth/sign-in-modal/SignInModal';
import SignUpModal from '../../components/auth/sign-up-modal/SignUpModal';

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

import {
  selectIsAuthenticated,
} from '../../redux/slices/auth/authSlice';

import {
  selectFavoriteIds,
  clearFavorites,
} from '../../redux/slices/favorites/favoritesSlice';

import {
  fetchFavoritesThunk,
  addFavoriteThunk,
  removeFavoriteThunk,
} from '../../redux/slices/favorites/favoritesOperations';

import css from './CategoryPage.module.scss';

const CategoryPage = () => {
  const dispatch = useDispatch();
  const { category } = useParams();

  const recipes = useSelector(selectRecipes);
  const status = useSelector(selectRecipesStatus);
  const error = useSelector(selectRecipesError);
  const page = useSelector(selectRecipesPage);
  const totalPages = useSelector(selectRecipesTotalPages);

  const ingredients = useSelector(selectIngredients);
  const areas = useSelector(selectAreas);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const favoriteIds = useSelector(selectFavoriteIds);

  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [authModal, setAuthModal] = useState(null);

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

  // Load favorites for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavoritesThunk({ page: 1, limit: 100 }));
    } else {
      dispatch(clearFavorites());
    }
  }, [dispatch, isAuthenticated]);

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

  const handleToggleFavorite = async recipeId => {
    if (!isAuthenticated) {
      setAuthModal('signIn');
      return;
    }

    try {
      if (favoriteIds.includes(recipeId)) {
        await dispatch(removeFavoriteThunk(recipeId)).unwrap();
      } else {
        await dispatch(addFavoriteThunk(recipeId)).unwrap();
      }
    } catch (error) {
      toast.error(
        typeof error === 'string'
          ? error
          : 'Failed to update favorites. Please try again.',
      );
    }
  };

  return (
    <main className={css.categoryPage}>
      <Hero />

      <div className="container">
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
              <RecipeList
                recipes={recipes}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
              />
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

      <Testimonials />

      <SignInModal
        isOpen={authModal === 'signIn'}
        onClose={() => setAuthModal(null)}
        onSwitchToSignUp={() => setAuthModal('signUp')}
      />

      <SignUpModal
        isOpen={authModal === 'signUp'}
        onClose={() => setAuthModal(null)}
        onSwitchToSignIn={() => setAuthModal('signIn')}
      />
    </main>
  );
};

export default CategoryPage;
