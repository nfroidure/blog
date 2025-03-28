import styles from "./social.module.scss";
import {
  BLUESKY_ACCOUNT,
  FACEBOOK_ACCOUNT,
  GITHUB_ACCOUNT,
  LINKEDIN_ACCOUNT,
  MASTODON_ACCOUNT,
  MASTODON_SERVER,
  NPM_ACCOUNT,
} from "../../utils/constants";
import { type Locale } from "../../i18n-config";
import { type Dictionary } from "../../dictionary";

export default function Social({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary["social"];
}) {
  return (
    <aside className={styles.iaSocial}>
      <nav>
        <ul>
          <li>
            <a
              href={`https://${MASTODON_SERVER}/@${MASTODON_ACCOUNT}`}
              rel="me"
              title={dictionary.mastodon.title}
              className={styles.iaSocialMastodon}
            >
              <span>{dictionary.mastodon.label}</span>
            </a>
          </li>
          <li>
            <a
              href={`https://bsky.app/profile/${BLUESKY_ACCOUNT}`}
              rel="me"
              title={dictionary.bluesky.title}
              className={styles.iaSocialBluesky}
            >
              <span>{dictionary.bluesky.label}</span>
            </a>
          </li>
          <li>
            <a
              href={`https://github.com/${GITHUB_ACCOUNT}`}
              title={dictionary.github.title}
              className={styles.iaSocialGithub}
            >
              <span>{dictionary.github.label}</span>
            </a>
          </li>
          <li>
            <a
              href={`https://www.npmjs.org/~${NPM_ACCOUNT}`}
              title={dictionary.npm.title}
              className={styles.iaSocialNpm}
            >
              <span>{dictionary.npm.label}</span>
            </a>
          </li>
          <li>
            <a
              href={`https://www.linkedin.com/in/${LINKEDIN_ACCOUNT}/`}
              rel="me"
              title={dictionary.linkedin.title}
              className={styles.iaSocialLinkedin}
            >
              <span>{dictionary.linkedin.label}</span>
            </a>
          </li>
          <li>
            <a
              href={`https://facebook.com/${FACEBOOK_ACCOUNT}`}
              rel="me"
              title={dictionary.facebook.title}
              className={styles.iaSocialFacebook}
            >
              <span>{dictionary.facebook.label}</span>
            </a>
          </li>
          <li>
            <a
              href={`/${locale}/blog/index.atom`}
              title={dictionary.feed.title}
              className={styles.iaSocialFeed}
            >
              <span>{dictionary.feed.label}</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
