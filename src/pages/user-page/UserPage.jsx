import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import UserBar from "../../components/profile/user-bar/UserBar";

import {
  selectUser,
  selectIsAuthenticated,
  selectAuthStatus,
} from "../../redux/slices/auth/authSlice";
import { getOwnRecipes } from "../../services/api/recipesApi";

import "./UserPage.scss";

function UserPage() {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);

  const { onLogout } = useOutletContext();

  const [recipes, setRecipes] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchRecipes = async () => {
      try {
        setIsLoadingRecipes(true);

        const response = await getOwnRecipes();
        const ownRecipes = response.data ?? response.recipes ?? [];

        setRecipes(Array.isArray(ownRecipes) ? ownRecipes : []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load your recipes.",
        );
      } finally {
        setIsLoadingRecipes(false);
      }
    };

    fetchRecipes();
  }, [isAuthenticated]);

  if (authStatus === "loading") {
    return <p className="user-page__message">Loading profile...</p>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="user-page">
      <div className="container user-page__container">
        <UserBar user={user} onLogout={onLogout} />

        <div className="user-page__content">
          <section className="user-page__section">
            <h2 className="user-page__title">My recipes</h2>

            {isLoadingRecipes ? (
              <p className="user-page__message">Loading recipes...</p>
            ) : recipes.length > 0 ? (
              <ul className="user-page__recipe-list">
                {recipes.map((recipe) => (
                  <li key={recipe.id} className="user-page__recipe-item">
                    {recipe.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="user-page__message">
                You haven't added any recipes yet.
              </p>
            )}
          </section>

          <section className="user-page__section">
            <h2 className="user-page__title">My favourites</h2>
            <p className="user-page__message">
              Favourite recipes will appear here.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default UserPage;
