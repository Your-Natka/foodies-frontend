import "./EmptyState.scss";

const emptyMessages = {
  recipes:
    "Nothing has been added to your recipes list yet. Please browse our recipes and add your favorites for easy access in the future.",

  favorites:
    "Nothing has been added to your favorite recipes list yet. Please browse our recipes and add your favorites for easy access in the future.",

  followers:
    "There are currently no followers on your account. Please engage on visitors with interesting content and draw their attention to your profile.",

  following:
    "Your account currently has no subscriptions to other users. Learn more about our users and select those whose content interests you.",
};

function EmptyState({ type = "recipes" }) {
  const message = emptyMessages[type];

  if (!message) return null;

  return (
    <div className="empty-state" role="status">
      <p className="empty-state__message">{message}</p>
    </div>
  );
}

export default EmptyState;
