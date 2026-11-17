import { toast } from "react-toastify";

import css from "./RecipeActions.module.scss";

const RecipeActions = ({ recipe, onStartCooking }) => {
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url,
        });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
        // Fall back to copying the link.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard.");
    } catch {
      toast.error("Could not copy the link.");
    }
  };

  return (
    <div className={`${css.actions} no-print`}>
      <button type="button" className={css.primary} onClick={onStartCooking}>
        Start cooking
      </button>
      <button type="button" className={css.button} onClick={handleShare}>
        Share
      </button>
      <button type="button" className={css.button} onClick={() => window.print()}>
        Print
      </button>
    </div>
  );
};

export default RecipeActions;
