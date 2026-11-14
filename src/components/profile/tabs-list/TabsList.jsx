import { useSearchParams } from "react-router-dom";

import ProfileRecipes from "../profile-recipes/ProfileRecipes";
import ProfileFavourites from "../profile-favourites/ProfileFavourites";

import "./TabsList.scss";

const tabs = [
  { id: "recipes", label: "My Recipes" },
  { id: "favourites", label: "My Favorites" },
  { id: "followers", label: "Followers" },
  { id: "following", label: "Following" },
];

function TabsList({ onProfileUpdate }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");

  const activeTab = tabs.some((tab) => tab.id === tabParam)
    ? tabParam
    : "recipes";

  const handleTabChange = (tabId) => {
    setSearchParams((prevParams) => {
      const nextParams = new URLSearchParams(prevParams);

      nextParams.set("tab", tabId);
      nextParams.delete("page");

      return nextParams;
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "recipes":
        return <ProfileRecipes onProfileUpdate={onProfileUpdate} />;

      case "favourites":
        return <ProfileFavourites onProfileUpdate={onProfileUpdate} />;

      case "followers":
      case "following":
        return (
          <p className="user-page__message">This section is coming soon.</p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="tabs-list">
      <div
        className="tabs-list__navigation"
        role="tablist"
        aria-label="Profile sections"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            id={`profile-${tab.id}-tab`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`profile-${tab.id}-panel`}
            className={`tabs-list__button ${
              activeTab === tab.id ? "tabs-list__button--active" : ""
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id={`profile-${activeTab}-panel`}
        role="tabpanel"
        aria-labelledby={`profile-${activeTab}-tab`}
        className="tabs-list__panel"
      >
        {renderContent()}
      </div>
    </div>
  );
}

export default TabsList;
