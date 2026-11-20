import { useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import ProfileRecipes from "../profile-recipes/ProfileRecipes";
import ProfileFavourites from "../profile-favourites/ProfileFavourites";
import ProfileFollowers from "../profile-followers/ProfileFollowers";
import UserRecipes from "../user-recipes/UserRecipes";

import "./TabsList.scss";

const ownTabs = [
  { id: "recipes", label: "My Recipes" },
  { id: "favourites", label: "My Favorites" },
  { id: "followers", label: "Followers" },
  { id: "following", label: "Following" },
];

const otherTabs = [
  { id: "recipes", label: "Recipes" },
  { id: "followers", label: "Followers" },
];

function TabsList({
  isOwnProfile = true,
  profileUserId,
  onProfileUpdate,
  recipes = [],
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabCache = useRef(new Map());

  const getCachedData = useCallback(
    (tabId, page = 1) => {
      const key = `${profileUserId}:${tabId}:${page}`;
      return tabCache.current.get(key);
    },
    [profileUserId],
  );

  const setCachedData = useCallback(
    (tabId, page, data) => {
      const key = `${profileUserId}:${tabId}:${page}`;
      tabCache.current.set(key, data);
    },
    [profileUserId],
  );

  const invalidateTabCache = useCallback(
    (tabId) => {
      const prefix = `${profileUserId}:${tabId}:`;

      for (const key of tabCache.current.keys()) {
        if (key.startsWith(prefix)) {
          tabCache.current.delete(key);
        }
      }
    },
    [profileUserId],
  );

  const tabs = isOwnProfile ? ownTabs : otherTabs;

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
        return isOwnProfile ? (
          <ProfileRecipes
            onProfileUpdate={onProfileUpdate}
            getCachedData={getCachedData}
            setCachedData={setCachedData}
          />
        ) : (
          <UserRecipes recipes={recipes} userId={profileUserId} />
        );

      case "favourites":
        return isOwnProfile ? (
          <ProfileFavourites
            onProfileUpdate={onProfileUpdate}
            getCachedData={getCachedData}
            setCachedData={setCachedData}
          />
        ) : null;

      case "followers":
        return (
          <ProfileFollowers
            type="followers"
            profileUserId={profileUserId}
            onProfileUpdate={onProfileUpdate}
            getCachedData={getCachedData}
            setCachedData={setCachedData}
            invalidateTabCache={invalidateTabCache}
          />
        );

      case "following":
        return isOwnProfile ? (
          <ProfileFollowers
            type="following"
            profileUserId={profileUserId}
            onProfileUpdate={onProfileUpdate}
            getCachedData={getCachedData}
            setCachedData={setCachedData}
            invalidateTabCache={invalidateTabCache}
          />
        ) : null;

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
