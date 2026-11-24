import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import { selectIsAuthenticated } from "../../redux/slices/auth/authSlice";

import {
  addStandaloneIngredient,
  clearAll,
  clearChecked,
  removeItem,
  removeRecipe,
  selectShoppingGroups,
  selectShoppingItems,
  selectShoppingStandaloneItems,
  toggleItem,
} from "../../redux/slices/shoppingList/shoppingListSlice";

import {
  selectIngredients,
  selectIngredientsStatus,
} from "../../redux/slices/ingredients/ingredientsSlice";
import { fetchIngredientsThunk } from "../../redux/slices/ingredients/ingredientsOperations";

import css from "./ShoppingListPage.module.scss";

const formatListAsText = (items) => {
  const grouped = new Map();

  items
    .filter((item) => !item.checked)
    .forEach((item) => {
      const title = item.recipeTitle || "Other ingredients";

      if (!grouped.has(title)) {
        grouped.set(title, []);
      }

      grouped
        .get(title)
        .push(`- ${item.name}${item.measure ? ` — ${item.measure}` : ""}`);
    });

  return [...grouped.entries()]
    .map(([title, lines]) => `${title}\n${lines.join("\n")}`)
    .join("\n\n");
};

function ShoppingListPage() {
  const dispatch = useDispatch();
  const { onRequireAuth } = useOutletContext();

  const [view, setView] = useState("recipes");
  const [previousView, setPreviousView] = useState("recipes");
  const [searchQuery, setSearchQuery] = useState("");

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const groups = useSelector(selectShoppingGroups);
  const items = useSelector(selectShoppingItems);
  const standaloneItems = useSelector(selectShoppingStandaloneItems);

  const ingredients = useSelector(selectIngredients);
  const ingredientsStatus = useSelector(selectIngredientsStatus);

  useEffect(() => {
    if (ingredientsStatus === "idle" || ingredientsStatus === "failed") {
      dispatch(fetchIngredientsThunk());
    }
  }, [dispatch, ingredientsStatus]);

  const checkedCount = items.filter((item) => item.checked).length;
  const remainingCount = items.length - checkedCount;

  const allGroups = useMemo(() => {
    const result = [...groups];

    if (standaloneItems.length > 0) {
      result.push({
        recipeId: null,
        recipeTitle: "Other ingredients",
        recipeThumb: null,
        items: standaloneItems,
      });
    }

    return result;
  }, [groups, standaloneItems]);

  const filteredIngredients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return ingredients;

    return ingredients.filter((ingredient) =>
      ingredient.name?.toLowerCase().includes(query),
    );
  }, [ingredients, searchQuery]);

  const isIngredientInList = (ingredientId) =>
    items.some((item) => String(item.ingredientId) === String(ingredientId));

  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      onRequireAuth();
      return false;
    }

    callback();
    return true;
  };

  const handleCopy = async () => {
    const text = formatListAsText(items);

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

      dispatch(clearAll());
      toast.success("Shopping list cleared.");
    });
  };

  const handleClearChecked = () => {
    if (checkedCount === 0) return;

    requireAuth(() => {
      dispatch(clearChecked());
      toast.success("Bought ingredients removed.");
    });
  };

  const handleRemoveRecipe = (recipeId) => {
    requireAuth(() => {
      dispatch(removeRecipe(recipeId));
      toast.success("Recipe removed from your shopping list.");
    });
  };

  const handleToggleItem = (itemKey) => {
    requireAuth(() => {
      dispatch(toggleItem(itemKey));
    });
  };

  const handleRemoveItem = (itemKey) => {
    requireAuth(() => {
      dispatch(removeItem(itemKey));
      toast.success("Ingredient removed.");
    });
  };

  const handleAddIngredient = (ingredient) => {
    requireAuth(() => {
      if (isIngredientInList(ingredient.id)) {
        toast.info("This ingredient is already in your shopping list.");
        return;
      }

      dispatch(
        addStandaloneIngredient({
          id: ingredient.id,
          name: ingredient.name,
          img: ingredient.img,
        }),
      );

      toast.success(`${ingredient.name} added to your shopping list.`);
    });
  };

  const openEditor = () => {
    setPreviousView(view);
    setView("editor");
    setSearchQuery("");
  };

  const goBack = () => {
    setView(view === "editor" ? previousView : "recipes");
  };

  const renderIngredient = (item) => (
    <li
      key={item.key}
      className={`${css.item} ${item.checked ? css.checked : ""}`}
    >
      <button
        type="button"
        className={css.removeItem}
        onClick={() => handleRemoveItem(item.key)}
        aria-label={`Remove ${item.name}`}
        title={`Remove ${item.name}`}
      >
        <svg aria-hidden="true">
          <use href="/images/sprite.svg#icon-close16x16" />
        </svg>
      </button>

      <input
        type="checkbox"
        className={css.checkbox}
        checked={item.checked}
        onChange={() => handleToggleItem(item.key)}
        id={`ingredient-${item.key}`}
      />

      <label className={css.label} htmlFor={`ingredient-${item.key}`}>
        <span className={css.imageWrapper}>
          {item.img && (
            <img
              className={css.image}
              src={item.img}
              alt=""
              width="60"
              height="60"
              loading="lazy"
            />
          )}
        </span>

        <span className={css.ingredientInfo}>
          <span className={css.name}>{item.name}</span>
          {item.measure && <span className={css.measure}>{item.measure}</span>}
        </span>
      </label>
    </li>
  );

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

            <button
              type="button"
              className={`${css.step} ${css.stepLink} ${
                view === "ingredients" ? css.stepActive : ""
              }`}
              onClick={() => setView("ingredients")}
              aria-pressed={view === "ingredients"}
            >
              <svg className={css.stepIcon} aria-hidden="true">
                <use href="/images/sprite.svg#icon-plus18x18-food" />
              </svg>
              <span className={css.stepTitle}>Add ingredients</span>
              <span className={css.stepArrowWrapper} aria-hidden="true">
                <svg className={css.stepArrow} viewBox="0 0 32 32">
                  <use href="/images/sprite.svg#icon-arrow-back" />
                </svg>
              </span>
            </button>

            <button
              type="button"
              className={`${css.step} ${css.stepLink} ${
                view === "editor" ? css.stepActive : ""
              }`}
              onClick={openEditor}
              aria-pressed={view === "editor"}
            >
              <svg className={css.stepIcon} aria-hidden="true">
                <use href="/images/sprite.svg#icon-basket" />
              </svg>
              <span className={css.stepTitle}>Shop with ease</span>
              <span className={css.stepArrowWrapper} aria-hidden="true">
                <svg className={css.stepArrow} viewBox="0 0 32 32">
                  <use href="/images/sprite.svg#icon-arrow-back" />
                </svg>
              </span>
            </button>
          </div>
        </section>

        {items.length > 0 && (
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
          </section>
        )}

        {view === "recipes" && (
          <>
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
                    <h2 className={css.emptyTitle}>
                      Your shopping list is empty
                    </h2>
                    <p className={css.emptyDescription}>
                      Looks like you haven&apos;t added anything to your
                      shopping list yet. Explore our recipes and add ingredients
                      to make your next shopping trip easier.
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
              <div className={css.groups}>
                {allGroups.map((group) => (
                  <section
                    key={group.recipeId ?? "standalone"}
                    className={css.group}
                  >
                    <div className={css.groupHeader}>
                      <h2 className={css.groupTitle}>
                        {group.recipeId ? (
                          <Link to={`/recipe/${group.recipeId}`}>
                            {group.recipeTitle}
                          </Link>
                        ) : (
                          group.recipeTitle
                        )}
                      </h2>

                      {group.recipeId && (
                        <button
                          type="button"
                          className={css.removeGroup}
                          onClick={() => handleRemoveRecipe(group.recipeId)}
                          aria-label={`Remove ${group.recipeTitle} recipe`}
                          title="Remove recipe"
                        >
                          <svg aria-hidden="true">
                            <use href="/images/sprite.svg#icon-close24x24" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className={css.groupContent}>
                      {group.recipeThumb && (
                        <div className={css.recipeInfo}>
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
                        </div>
                      )}

                      <div className={css.ingredientsContent}>
                        <ul className={css.list}>
                          {group.items.map(renderIngredient)}
                        </ul>
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}

        {view === "ingredients" && (
          <section className={css.modeContent}>
            <button
              type="button"
              className={css.backLink}
              onClick={goBack}
              aria-label="Back to recipes"
            >
              <svg
                className={css.backStepIcon}
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <use href="/images/sprite.svg#icon-arrow-back" />
              </svg>
              <span>BACK</span>
            </button>

            <h2 className={css.modeTitle}>Ingredients to buy</h2>
            <p className={css.modeDescription}>
              All ingredients from your selected recipes in one list.
            </p>

            {items.length === 0 ? (
              <p className={css.emptyMessage}>
                Your list is empty. Add a recipe or use Shop with ease to add
                ingredients.
              </p>
            ) : (
              <ul className={`${css.list} ${css.allIngredients}`}>
                {items.map(renderIngredient)}
              </ul>
            )}
          </section>
        )}

        {view === "editor" && (
          <section className={css.modeContent}>
            <button
              type="button"
              className={css.backLink}
              onClick={goBack}
              aria-label="Back to previous view"
            >
              <svg
                className={css.backStepIcon}
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <use href="/images/sprite.svg#icon-arrow-back" />
              </svg>
              <span>BACK</span>
            </button>

            <h2 className={css.modeTitle}>Manage your shopping list</h2>
            <p className={css.modeDescription}>
              Search the ingredient catalog, add products, or remove items from
              your list.
            </p>

            <div className={css.editorLayout}>
              <div className={css.editorCurrentList}>
                <h3 className={css.sectionTitle}>Your list ({items.length})</h3>

                {items.length === 0 ? (
                  <p className={css.emptyMessage}>
                    You haven&apos;t added any ingredients yet.
                  </p>
                ) : (
                  <ul className={css.list}>{items.map(renderIngredient)}</ul>
                )}
              </div>

              <div className={css.catalogPanel}>
                <h3 className={css.sectionTitle}>Ingredient catalog</h3>

                <input
                  className={css.searchInput}
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search ingredients..."
                  aria-label="Search ingredients"
                />

                {ingredientsStatus === "loading" ? (
                  <p className={css.catalogStatus}>Loading ingredients...</p>
                ) : ingredientsStatus === "failed" ? (
                  <p className={css.catalogStatus}>
                    Could not load ingredients. Please try again later.
                  </p>
                ) : filteredIngredients.length === 0 ? (
                  <p className={css.catalogStatus}>No ingredients found.</p>
                ) : (
                  <ul className={css.catalogList}>
                    {filteredIngredients.map((ingredient) => {
                      const alreadyAdded = isIngredientInList(ingredient.id);

                      return (
                        <li key={ingredient.id} className={css.catalogItem}>
                          <span className={css.catalogImage}>
                            {ingredient.img && (
                              <img src={ingredient.img} alt="" loading="lazy" />
                            )}
                          </span>

                          <span className={css.catalogInfo}>
                            {ingredient.name}
                          </span>

                          {alreadyAdded ? (
                            <span className={css.addedLabel}>Added</span>
                          ) : (
                            <button
                              type="button"
                              className={css.addIngredientButton}
                              onClick={() => handleAddIngredient(ingredient)}
                            >
                              + Add
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default ShoppingListPage;
