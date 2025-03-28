import styles from "./share.module.scss";
import { DOMAIN_NAME, ORGANISATION_CONTACT } from "../../utils/constants";
import Paragraph from "./p";
import Anchor from "./a";
import Heading2 from "./h2";
import { type Dictionary } from "../../dictionary";

export default function Share({
  url,
  title,
  dictionary,
}: {
  url: string;
  title: string;
  dictionary: Dictionary["share"];
}) {
  return (
    <aside className={styles.root}>
      <Heading2>{dictionary.title}</Heading2>
      <Paragraph>
        <Anchor
          href={`https://www.facebook.com/dialog/share?display=popup&href=${encodeURIComponent(url)}&redirect_uri=${encodeURIComponent(`https://${DOMAIN_NAME}`)}`}
          title={dictionary.facebook.title}
          target="_blank"
        >
          <span className={[styles.icon, styles.facebook].join(" ")} />
          {dictionary.facebook.link}
        </Anchor>
        {" - "}
        <Anchor
          href={`https://bsky.app/intent/compose?text=${encodeURIComponent(url)}`}
          title={dictionary.bluesky.title}
          target="_blank"
        >
          <span className={[styles.icon, styles.bluesky].join(" ")} />
          {dictionary.bluesky.link}
        </Anchor>
        {" - "}
        <Anchor
          href={`mailto:${ORGANISATION_CONTACT}?subject=${encodeURIComponent(title)}`}
          title={dictionary.answer.title}
          target="_blank"
        >
          <span className={[styles.icon, styles.mail].join(" ")} />
          {dictionary.answer.link}
        </Anchor>
      </Paragraph>
    </aside>
  );
}
