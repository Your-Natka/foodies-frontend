import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  clearCurrentRecipe,
  selectCurrentRecipe,
  selectRecipeStatus,
  selectRecipesError,
  selectPopularRecipes,
  selectPopularStatus,
} from '../../redux/slices/recipes/recipesSlice';

import {
  fetchRecipeByIdThunk,
  fetchPopularRecipesThunk,
} from '../../redux/slices/recipes/recipesOperations';

import { selectIsAuthenticated } from '../../redux/slices/auth/authSlice';

import {
  selectFavoriteIds,
  clearFavorites,
} from '../../redux/slices/favorites/favoritesSlice';

import {
  fetchFavoritesThunk,
  addFavoriteThunk,
  removeFavoriteThunk,
} from '../../redux/slices/favorites/favoritesOperations';

import RecipeInfo from '../../components/recipe-details/recipe-info/RecipeInfo';
import RecipeIngredients from '../../components/recipe-details/recipe-ingredients/RecipeIngredients';
import RecipePreparation from '../../components/recipe-details/recipe-preparation/RecipePreparation';
import RecipeFavoriteButton from '../../components/recipe-details/recipe-favorite-button/RecipeFavoriteButton';
import PathInfo from '../../components/recipe-details/path-info/PathInfo';
import PopularRecipes from '../../components/recipes/popular-recipes/PopularRecipes';

import SignInModal from '../../components/auth/sign-in-modal/SignInModal';
import SignUpModal from '../../components/auth/sign-up-modal/SignUpModal';

import css from './RecipePage.module.scss';

const RecipePage = () => {
 const { id } = useParams();
 const dispatch = useDispatch();
 const navigate = useNavigate();

  const recipe = useSelector(selectCurrentRecipe);
  const status = useSelector(selectRecipeStatus);
  const error = useSelector(selectRecipesError);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const favoriteIds = useSelector(selectFavoriteIds);
  const popularRecipes = useSelector(selectPopularRecipes);
  const popularStatus = useSelector(selectPopularStatus);

  const [authModal, setAuthModal] = useState(null);

  useEffect(() => {
    dispatch(clearCurrentRecipe());
    dispatch(fetchRecipeByIdThunk(id));

    return () => {
      dispatch(clearCurrentRecipe());
    };
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchPopularRecipesThunk());
  }, [dispatch]);

  // Load favorites for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavoritesThunk({ page: 1, limit: 100 }));
    } else {
      dispatch(clearFavorites());
    }
  }, [dispatch, isAuthenticated]);
    
    const handleAuthorClick = () => {
        if (!isAuthenticated) {
            setAuthModal('signIn');
            return;
        }

        if (recipe?.owner?.id) {
            navigate(`/user/${recipe.owner.id}`);
        }
    };

  const isFavorite = recipe
    ? favoriteIds.includes(recipe.id)
    : false;

  const handleToggleFavorite = async (recipeId = recipe?.id) => {
    if (!recipeId) return;

    if (!isAuthenticated) {
      setAuthModal('signIn');
      return;
    }

    const isRecipeFavorite = favoriteIds.includes(recipeId);

    try {
      if (isRecipeFavorite) {
        await dispatch(removeFavoriteThunk(recipeId)).unwrap();
        toast.success('Recipe removed from favorites.');
      } else {
        await dispatch(addFavoriteThunk(recipeId)).unwrap();
        toast.success('Recipe added to favorites.');
      }
    } catch (error) {
      toast.error(
        typeof error === 'string'
          ? error
          : 'Failed to update favorites. Please try again.',
      );
    }
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <main>
        <p>Loading recipe...</p>
      </main>
    );
  }

  if (status === 'failed') {
    const isNotFound = error?.toLowerCase().includes('recipe not found');

    return (
      <main>
        <p>
          {isNotFound
            ? 'Recipe not found.'
            : error || 'Something went wrong. Please try again.'}
        </p>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main>
        <p>Recipe not found.</p>
      </main>
    );
  }

  return (
    <main className={css.recipePage}>
        <div className="container">
           <PathInfo title={recipe.title} />

            <div className={css.recipeInfoWrapper}>
            <RecipeInfo recipe={recipe} onAuthorClick={handleAuthorClick}>
                <RecipeIngredients ingredients={recipe.ingredients} />

                <RecipePreparation instructions={recipe.instructions} />

                <RecipeFavoriteButton
                isFavorite={isFavorite}
                onClick={handleToggleFavorite}
                />
            </RecipeInfo>
            </div>

            <div className={css.popularRecipesWrapper}>
            {popularStatus === 'loading' && (
                <p>Loading popular recipes...</p>
            )}

            {popularStatus === 'failed' && (
                <p>Failed to load popular recipes.</p>
            )}

            {popularStatus === 'succeeded' && (
                <PopularRecipes
                recipes={popularRecipes}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                />
            )}
            </div>   
        </div>

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

export default RecipePage;