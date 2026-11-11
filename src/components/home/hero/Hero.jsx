import { Link } from "react-router-dom";
import Section from "../../common/Section/Section";
import "./Hero.scss";

function Hero() {
  return (
    <Section className="hero-section" containerVariant="hero">
      <div className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="hero__title-line">Improve Your</span>
            <span className="hero__title-bottom">
              <span>Culinary</span> <span>Talents</span>
            </span>
          </h1>

          <p className="hero__description">
            Amazing recipes for beginners in the world of cooking, enveloping
            you in the aromas and tastes of various cuisines.
          </p>

          <Link to="/add" className="hero__button">
            Add recipe
          </Link>

          <div className="hero__images">
            {/* Small decorative image */}
            <picture className="hero__picture hero__picture--small">
              <source
                media="(max-width: 374px)"
                type="image/avif"
                srcSet="
                /images/hero/hero-small-mob@1.avif 1x,
                /images/hero/hero-small-mob@2.avif 2x
              "
              />
              <source
                media="(max-width: 374px)"
                type="image/webp"
                srcSet="
                /images/hero/hero-small-mob@1.webp 1x,
                /images/hero/hero-small-mob@2.webp 2x
              "
              />
              <source
                media="(max-width: 374px)"
                srcSet="
                /images/hero/hero-small-mob@1.png 1x,
                /images/hero/hero-small-mob@2.png 2x
              "
              />
              <source
                media="(max-width: 767px)"
                type="image/avif"
                srcSet="
                /images/hero/hero-small-desktop@1.avif 1x,
                /images/hero/hero-small-desktop@2.avif 2x
              "
              />
              <source
                media="(max-width: 767px)"
                type="image/webp"
                srcSet="
                /images/hero/hero-small-desktop@1.webp 1x,
                /images/hero/hero-small-desktop@2.webp 2x
              "
              />
              <source
                media="(max-width: 767px)"
                srcSet="
                /images/hero/hero-small-desktop@1.png 1x,
                /images/hero/hero-small-desktop@2.png 2x
              "
              />
              <source
                type="image/avif"
                srcSet="
                /images/hero/hero-small-desktop@1.avif 1x,
                /images/hero/hero-small-desktop@2.avif 2x
              "
              />
              <source
                type="image/webp"
                srcSet="
                /images/hero/hero-small-desktop@1.webp 1x,
                /images/hero/hero-small-desktop@2.webp 2x
              "
              />
              <img
                src="/images/hero/hero-small-desktop@1.png"
                srcSet="
                /images/hero/hero-small-desktop@1.png 1x,
                /images/hero/hero-small-desktop@2.png 2x
              "
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
              />
            </picture>

            {/* Big decorative image */}
            <picture className="hero__picture hero__picture--big">
              <source
                media="(max-width: 374px)"
                type="image/avif"
                srcSet="
                /images/hero/hero-big-mob@1.avif 1x,
                /images/hero/hero-big-mob@2.avif 2x
              "
              />
              <source
                media="(max-width: 374px)"
                type="image/webp"
                srcSet="
                /images/hero/hero-big-mob@1.webp 1x,
                /images/hero/hero-big-mob@2.webp 2x
              "
              />
              <source
                media="(max-width: 374px)"
                srcSet="
                /images/hero/hero-big-mob@1.png 1x,
                /images/hero/hero-big-mob@2.png 2x
              "
              />
              <source
                media="(max-width: 767px)"
                type="image/avif"
                srcSet="
                /images/hero/hero-big-desktop@1.avif 1x,
                /images/hero/hero-big-desktop@2.avif 2x
              "
              />
              <source
                media="(max-width: 767px)"
                type="image/webp"
                srcSet="
                /images/hero/hero-big-desktop@1.webp 1x,
                /images/hero/hero-big-desktop@2.webp 2x
              "
              />
              <source
                media="(max-width: 767px)"
                srcSet="
                /images/hero/hero-big-desktop@1.png 1x,
                /images/hero/hero-big-desktop@2.png 2x
              "
              />
              <source
                type="image/avif"
                srcSet="
                /images/hero/hero-big-desktop@1.avif 1x,
                /images/hero/hero-big-desktop@2.avif 2x
              "
              />
              <source
                type="image/webp"
                srcSet="
                /images/hero/hero-big-desktop@1.webp 1x,
                /images/hero/hero-big-desktop@2.webp 2x
              "
              />
              <img
                src="/images/hero/hero-big-desktop@1.png"
                srcSet="
                /images/hero/hero-big-desktop@1.png 1x,
                /images/hero/hero-big-desktop@2.png 2x
              "
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Hero;
