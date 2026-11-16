import css from './RecipePreparation.module.scss';

const RecipePreparation = ({ instructions = '' }) => {
  const paragraphs = instructions
    .split(/\n+/)
    .filter(paragraph => paragraph.trim());

  return (
    <section className={css.preparation}>
      <h3 className={css.title}>RECIPE PREPARATION</h3>

      <div className={css.content}>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={css.paragraph}>
            {paragraph.trim()}
          </p>
        ))}
      </div>
    </section>
  );
};

export default RecipePreparation;
