import { Link } from "react-router-dom";
import "./UserCard.scss";

function UserCard({
  user,
  onFollowToggle,
  isFollowLoading = false,
  showFollowButton = true,
}) {
  const {
    id,
    name,
    avatar,
    recipesCount = 0,
    recipes = [],
    isFollowing = false,
  } = user;

  return (
    <article className="user-card">
      <div className="user-card__info">
        <div className="user-card__avatar">
          <Link to={`/user/${id}`} aria-label={`Open ${name}'s profile`}>
            {avatar ? (
              <img src={avatar} alt={name} />
            ) : (
              <span>{name?.charAt(0).toUpperCase() || "U"}</span>
            )}
          </Link>
        </div>

        <div className="user-card__details">
          <Link to={`/user/${id}`} className="user-card__profile">
            <h3 className="user-card__name">{name}</h3>
            <p className="user-card__recipes-count">
              Own recipes: {recipesCount}
            </p>
          </Link>

          {showFollowButton && (
            <button
              type="button"
              className="user-card__follow-btn"
              onClick={() => onFollowToggle?.(id, isFollowing)}
              disabled={isFollowLoading}
            >
              {isFollowLoading
                ? "Loading..."
                : isFollowing
                  ? "UNFOLLOW"
                  : "FOLLOW"}
            </button>
          )}
        </div>
      </div>

      {recipes.length > 0 && (
        <div className="user-card__recipes">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className="user-card__recipe"
            >
              <img src={recipe.thumb} alt="Recipe preview" />
            </Link>
          ))}
        </div>
      )}

      <Link
        to={`/user/${id}`}
        className="user-card__open-profile"
        aria-label={`Open ${name}'s profile`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 17L17 7M8 7h9v9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </article>
  );
}

export default UserCard;
