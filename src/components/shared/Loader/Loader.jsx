import styles from "./Loader.module.scss";

function Loader({ text = "Loading..." }) {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loaderModal}>
        <span className={styles.loaderSpinner} />
        <p className={styles.loaderText}>{text}</p>
      </div>
    </div>
  );
}

export default Loader;
