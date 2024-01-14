import styles from "./items.module.scss";
import Heading2 from "../../../../components/h2";
import Paragraph from "../../../../components/p";
import Anchor from "../../../../components/a";
import Img from "../../../../components/img";
import { type BaseContentPageMetadata } from "../../../../../utils/contents";
import { type Dictionary } from "../../../../../dictionary";

export default function Items<T extends BaseContentPageMetadata>({
  entries,
  base,
  dictionary,
}: {
  entries: T[];
  base: string;
  dictionary: Dictionary["blog"];
}) {
  return (
    <div className={styles.entries}>
      {entries.map((entry) => (
        <div className={styles.entry_item} key={entry.id}>
          {entry.illustration ? (
            <p className={styles.entry_illustration}>
              <Anchor
                href={`${base}/${entry.id}`}
                title={dictionary.read.title}
              >
                <Img
                  float="left"
                  orientation="landscape"
                  src={entry.illustration.url}
                  alt={entry.illustration.alt}
                />
              </Anchor>
            </p>
          ) : null}
          <Heading2 className={styles.entry_title}>
            <Anchor
              href={`${base}/${entry.id}`}
              title={dictionary.read.title}
              className={styles.entry_link}
            >
              {entry.title}
            </Anchor>
          </Heading2>
          <Paragraph className={styles.entry_description}>
            {entry.description} <br />
            <Anchor href={`${base}/${entry.id}`} title={dictionary.read.title}>
              {dictionary.read.link}
            </Anchor>
          </Paragraph>
          <Paragraph className={styles.entry_time}>
            {dictionary.publishedAt}{" "}
            {new Intl.DateTimeFormat("fr-FR", {
              timeZone: "Europe/Paris",
              dateStyle: "full",
              timeStyle: "medium",
            }).format(Date.parse(entry.date))}
            .
          </Paragraph>
          <div className={styles.clear}></div>
        </div>
      ))}
    </div>
  );
}
