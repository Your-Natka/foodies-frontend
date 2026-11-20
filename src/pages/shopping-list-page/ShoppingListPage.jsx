import { useDispatch, useSelector } from "react-redux";
import { Link, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import EmptyState from "../../components/shared/empty-state/EmptyState";

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
      return;
    }

    callback();
  };

  const handleCopy = async () => {
    const text = formatListAsText(groups);

    if (!text) {
      toast.info("Everything is already bought.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Shopping list copied to clipboard.");
    } catch {
      toast.error("Could not copy the list.");
    }
  };

  const handleClearAll = () => {
    requireAuth(() => {
      if (window.confirm("Remove all items from the shopping list?")) {
        dispatch(clearAll());
      }
    });
  };

  const handleClearChecked = () => {
    requireAuth(() => dispatch(clearChecked()));
  };

  const handleRemoveRecipe = (recipeId) => {
    requireAuth(() => dispatch(removeRecipe(recipeId)));
  };

  const handleToggleItem = (itemKey) => {
    requireAuth(() => dispatch(toggleItem(itemKey)));
  };

  const handleRemoveItem = (itemKey) => {
    requireAuth(() => dispatch(removeItem(itemKey)));
  };

  return (
    <main className={css.page}>
      <div className="container">
        <h1 className={css.title}>Shopping list</h1>

        {items.length === 0 ? (
          <>
            <EmptyState type="shopping" />
            <Link to="/recipes" className={css.browseLink}>
              Browse recipes
            </Link>
          </>
        ) : (
          <>
            <div className={css.toolbar}>
              <p className={css.summary}>
                {remainingCount} to buy · {checkedCount} bought
              </p>

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
                  <div className={css.groupHeader}>
                    <Link
                      to={`/recipe/${group.recipeId}`}
                      className={css.groupTitle}
                    >
                      {group.recipeTitle}
                    </Link>

                    <button
                      type="button"
                      className={css.removeGroup}
                      onClick={() => handleRemoveRecipe(group.recipeId)}
                    >
                      Remove recipe
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
                        <label className={css.label}>
                          <input
                            type="checkbox"
                            className={css.checkbox}
                            checked={item.checked}
                            onChange={() => handleToggleItem(item.key)}
                          />

                          {item.img && (
                            <img
                              className={css.image}
                              src={item.img}
                              alt=""
                              width="48"
                              height="48"
                              loading="lazy"
                            />
                          )}

                          <span className={css.text}>
                            <span className={css.name}>{item.name}</span>
                            <span className={css.measure}>{item.measure}</span>
                          </span>
                        </label>

                        <button
                          type="button"
                          className={css.removeItem}
                          onClick={() => handleRemoveItem(item.key)}
                          aria-label={`Remove ${item.name}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default ShoppingListPage;
