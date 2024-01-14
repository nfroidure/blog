import styles from "./header.module.scss";
import { type Dictionary } from "../../dictionary";
import { type Locale } from "../../i18n-config";

export default function Header({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <header className={styles.iaHeader}>
      <div className={styles.iaHeaderTitle}>
        <h1>
          <a
            href={`/${locale}`}
            title={dictionary.menu.home.title}
            className={styles.iaHeaderLogo}
          >
            <img src="/images/logo.svg" alt={dictionary.header.alt} />
          </a>
        </h1>
      </div>
    </header>
  );
}
