import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.iaFooter}>
      <p className={styles.iaFooterContent}>
        © Nicolas Froidure 2012-{new Date().getFullYear()}
      </p>
    </footer>
  );
}
