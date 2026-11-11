const socialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/goITclub/",
    icon: "icon-facebook-food",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/goitclub/",
    icon: "icon-instagram-food",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/c/GoIT",
    icon: "icon-youtube-food",
  },
];

function NetworkLinks() {
  return (
    <ul className="footer__social-list">
      {socialLinks.map(({ name, url, icon }) => (
        <li className="footer__social-item" key={name}>
          <a
            href={url}
            className="footer__social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
          >
            <svg className="footer__social-icon" aria-hidden="true">
              <use href={`/images/sprite.svg#${icon}`} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default NetworkLinks;
