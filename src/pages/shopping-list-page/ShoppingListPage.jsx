import { useDispatch, useSelector } from "react-redux";
import { Link, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import { selectIsAuthenticated } from "../../redux/slices/auth/authSlice";

import {
  clearAll,
  clearChecked,
  removeItem,
  removeRecipe,
  selectShoppingGroups,
  selectShoppingItems,
  toggleItem,
} from "../../redux/slices/shoppingList/shoppingListSlice";

import css from "./ShoppingListPage.module.scss";

const formatListAsText = (groups) =>
  groups
    .map(({ recipeTitle, items }) => {
      const lines = items
        .filter((item) => !item.checked)
        .map(
          (item) => `- ${item.name}${item.measure ? ` — ${item.measure}` : ""}`,
        );

      return lines.length ? `${recipeTitle}\n${lines.join("\n")}` : "";
    })
    .filter(Boolean)
    .join("\n\n");

function ShoppingListPage() {
  const dispatch = useDispatch();
  const { onRequireAuth } = useOutletContext();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const groups = useSelector(selectShoppingGroups);
  const items = useSelector(selectShoppingItems);

  const checkedCount = items.filter((item) => item.checked).length;
  const remainingCount = items.length - checkedCount;

  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      onRequireAuth();
      return false;
    }

    callback();
    return true;
  };

  const handleCopy = async () => {
    const text = formatListAsText(groups);

    if (!text) {
      toast.info("Everything is already bought.");
      return;
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard is not available.");
      }

      await navigator.clipboard.writeText(text);
      toast.success("Shopping list copied to clipboard.");
    } catch {
      toast.error("Could not copy the shopping list. Please try again.");
    }
  };

  const handleClearAll = () => {
    requireAuth(() => {
      if (!window.confirm("Remove all items from the shopping list?")) {
        return;
      }

      try {
        dispatch(clearAll());
        toast.success("Shopping list cleared.");
      } catch {
        toast.error("Could not clear the shopping list.");
      }
    });
  };

  const handleClearChecked = () => {
    if (checkedCount === 0) return;

    requireAuth(() => {
      try {
        dispatch(clearChecked());
        toast.success("Bought ingredients removed.");
      } catch {
        toast.error("Could not remove bought ingredients.");
      }
    });
  };

  const handleRemoveRecipe = (recipeId) => {
    requireAuth(() => {
      try {
        dispatch(removeRecipe(recipeId));
        toast.success("Recipe removed from your shopping list.");
      } catch {
        toast.error("Could not remove this recipe.");
      }
    });
  };

  const handleToggleItem = (itemKey) => {
    requireAuth(() => {
      try {
        dispatch(toggleItem(itemKey));
      } catch {
        toast.error("Could not update the ingredient.");
      }
    });
  };

  const handleRemoveItem = (itemKey) => {
    requireAuth(() => {
      try {
        dispatch(removeItem(itemKey));
        toast.success("Ingredient removed.");
      } catch {
        toast.error("Could not remove this ingredient.");
      }
    });
  };

  return (
    <main className={css.page}>
      <div className="container">
        <nav aria-label="Breadcrumbs">
          <ol className={css.breadcrumbs}>
            <li>
              <Link to="/" className={css.crumbLink}>
                Home
              </Link>
            </li>

            <li aria-hidden="true" className={css.breadcrumbSeparator}>
              /
            </li>

            <li aria-current="page">Shopping List</li>
          </ol>
        </nav>

        <header className={css.pageHeader}>
          <h1 className={css.title}>Shopping List</h1>
          <p className={css.pageDescription}>
            Everything you need for your next delicious meal.
          </p>
        </header>

        {items.length > 0 && (
          <section className={css.howItWorks}>
            <h2 className={css.howItWorksTitle}>How it works</h2>

            <div className={css.steps}>
              <Link to="/#categories" className={`${css.step} ${css.stepLink}`}>
                <svg className={css.stepIcon} aria-hidden="true">
                  <use href="/images/sprite.svg#icon-search" />
                </svg>

                <span className={css.stepTitle}>Find a recipe</span>

                <span className={css.stepArrowWrapper} aria-hidden="true">
                  <svg className={css.stepArrow} viewBox="0 0 32 32">
                    <use href="/images/sprite.svg#icon-arrow-back" />
                  </svg>
                </span>
              </Link>

              <div className={css.step}>
                <svg className={css.stepIcon} aria-hidden="true">
                  <use href="/images/sprite.svg#icon-plus18x18-food" />
                </svg>

                <span className={css.stepTitle}>Add ingredients</span>

                <span className={css.stepArrowWrapper} aria-hidden="true">
                  <svg className={css.stepArrow} viewBox="0 0 32 32">
                    <use href="/images/sprite.svg#icon-arrow-back" />
                  </svg>
                </span>
              </div>

              <div className={css.step}>
                <svg className={css.stepIcon} aria-hidden="true">
                  <use href="/images/sprite.svg#icon-basket" />
                </svg>

                <span className={css.stepTitle}>Shop with ease</span>
              </div>
            </div>
          </section>
        )}

        {items.length === 0 ? (
          <section className={css.emptySection}>
            <div className={css.emptyHero}>
              <picture className={css.heroPicture}>
                <source
                  type="image/avif"
                  media="(max-width: 767px)"
                  srcSet="
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@1-mob.avif 1x,
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@2-mob.avif 2x
                  "
                />
                <source
                  type="image/webp"
                  media="(max-width: 767px)"
                  srcSet="
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@1-mob.webp 1x,
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@2-mob.webp 2x
                  "
                />

                <source
                  type="image/avif"
                  media="(min-width: 768px) and (max-width: 1439px)"
                  srcSet="
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@1-tab.avif 1x,
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@2-tab.avif 2x
                  "
                />
                <source
                  type="image/webp"
                  media="(min-width: 768px) and (max-width: 1439px)"
                  srcSet="
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@1-tab.webp 1x,
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@2-tab.webp 2x
                  "
                />

                <source
                  type="image/avif"
                  srcSet="
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@1-des.avif 1x,
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@2-des.avif 2x
                  "
                />
                <source
                  type="image/webp"
                  srcSet="
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@1-des.webp 1x,
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@2-des.webp 2x
                  "
                />

                <img
                  className={css.heroImage}
                  src="/images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@1-des.png"
                  srcSet="
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@1-des.png 1x,
                    /images/shoping/Fresh%20groceries%20%E2%80%94%20supplied@2-des.png 2x
                  "
                  alt="Fresh groceries and ingredients for cooking"
                  width="812"
                  height="482"
                />
              </picture>

              <div className={css.emptyContent}>
                <h2 className={css.emptyTitle}>Your shopping list is empty</h2>

                <p className={css.emptyDescription}>
                  Looks like you haven&apos;t added anything to your shopping
                  list yet. Explore our recipes and add ingredients to make your
                  next shopping trip easier.
                </p>

                <Link to="/#categories" className={css.browseLink}>
                  Browse recipes
                  <span className={css.browseArrow} aria-hidden="true">
                    <svg
                      className={css.backIcon}
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                    >
                      <use href="/images/sprite.svg#icon-arrow-back" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className={css.shoppingSection}>
            <div className={css.toolbar}>
              <div className={css.summary}>
                <div className={css.summaryItem}>
                  <span className={css.summaryValue}>{groups.length}</span>
                  <span className={css.summaryLabel}>
                    {groups.length === 1 ? "recipe" : "recipes"}
                  </span>
                </div>

                <span className={css.summaryDivider} aria-hidden="true">
                  ·
                </span>

                <div className={css.summaryItem}>
                  <span className={css.summaryValue}>{items.length}</span>
                  <span className={css.summaryLabel}>ingredients</span>
                </div>

                <span className={css.summaryDivider} aria-hidden="true">
                  ·
                </span>

                <div className={css.summaryItem}>
                  <span className={css.summaryValue}>{remainingCount}</span>
                  <span className={css.summaryLabel}>to buy</span>
                </div>

                <span className={css.summaryDivider} aria-hidden="true">
                  ·
                </span>

                <div className={css.summaryItem}>
                  <span className={css.summaryValue}>{checkedCount}</span>
                  <span className={css.summaryLabel}>bought</span>
                </div>
              </div>

              <div className={css.actions}>
                <button
                  type="button"
                  className={css.action}
                  onClick={handleCopy}
                >
                  Copy as text
                </button>

                <button
                  type="button"
                  className={css.action}
                  onClick={handleClearChecked}
                  disabled={checkedCount === 0}
                >
                  Clear bought
                </button>

                <button
                  type="button"
                  className={css.action}
                  onClick={handleClearAll}
                >
                  Clear all
                </button>
              </div>
            </div>

            <div className={css.groups}>
              {groups.map((group) => (
                <section key={group.recipeId} className={css.group}>
                  <div className={css.recipeInfo}>
                    <h2 className={css.groupTitle}>
                      <Link to={`/recipe/${group.recipeId}`}>
                        {group.recipeTitle}
                      </Link>
                    </h2>

                    {group.recipeThumb && (
                      <Link
                        to={`/recipe/${group.recipeId}`}
                        className={css.recipeImageLink}
                        aria-label={`View ${group.recipeTitle} recipe`}
                      >
                        <img
                          className={css.recipeThumb}
                          src={group.recipeThumb}
                          alt={group.recipeTitle}
                          width="550"
                          height="444"
                          loading="lazy"
                        />
                      </Link>
                    )}
                  </div>

                  <div className={css.ingredientsContent}>
                    <div className={css.ingredientsHeader}>
                      <h3 className={css.ingredientsTitle}>Ingredients</h3>

                      <button
                        type="button"
                        className={css.removeGroup}
                        onClick={() => handleRemoveRecipe(group.recipeId)}
                        aria-label={`Remove ${group.recipeTitle} recipe`}
                        title="Remove recipe"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>

                    <ul className={css.list}>
                      {group.items.map((item) => (
                        <li
                          key={item.key}
                          className={`${css.item} ${
                            item.checked ? css.checked : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className={css.checkbox}
                            checked={item.checked}
                            onChange={() => handleToggleItem(item.key)}
                            id={`ingredient-${item.key}`}
                          />

                          <label
                            className={css.label}
                            htmlFor={`ingredient-${item.key}`}
                          >
                            <span className={css.imageWrapper}>
                              {item.img && (
                                <img
                                  className={css.image}
                                  src={item.img}
                                  alt=""
                                  width="55"
                                  height="55"
                                  loading="lazy"
                                />
                              )}
                            </span>

                            <span className={css.ingredientInfo}>
                              <span className={css.name}>{item.name}</span>
                              {item.measure && (
                                <span className={css.measure}>
                                  {item.measure}
                                </span>
                              )}
                            </span>
                          </label>

                          <button
                            type="button"
                            className={css.removeItem}
                            onClick={() => handleRemoveItem(item.key)}
                            aria-label={`Remove ${item.name}`}
                            title={`Remove ${item.name}`}
                          >
                            <span aria-hidden="true">×</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default ShoppingListPage;
