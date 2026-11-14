import { Link } from "react-router-dom";

import Section from "../../components/common/Section/Section";
import RecipeForm from "../../components/forms/recipe-form/RecipeForm";

import "./AddRecipePage.scss";

function AddRecipePage() {
  return (
    <Section className="add-recipe-page">
      <div className="add-recipe-page__intro">
        <nav aria-label="Breadcrumbs">
          <ol className="add-recipe-page__breadcrumbs">
            <li>
              <Link to="/" className="add-recipe-page__crumb-link">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="add-recipe-page__crumb-divider">
              /
            </li>
            <li aria-current="page">Add recipe</li>
          </ol>
        </nav>

        <div className="add-recipe-page__heading">
          <h1 className="add-recipe-page__title">Add recipe</h1>
          <p className="add-recipe-page__text">
            Reveal your culinary art, share your favorite recipe and create
            gastronomic masterpieces with us.
          </p>
        </div>
      </div>

      <RecipeForm />
    </Section>
  );
}

export default AddRecipePage;
