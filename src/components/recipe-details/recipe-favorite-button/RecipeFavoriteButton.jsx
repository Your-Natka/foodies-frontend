
import css from './RecipeFavoriteButton.module.scss';

const RecipeFavoriteButton = ({
  isFavorite = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={css.button}
      onClick={onClick}
    >
      {isFavorite ? 'REMOVE FROM FAVORITES' : 'ADD TO FAVORITES'}
    </button>
  );
};

export default RecipeFavoriteButton;
