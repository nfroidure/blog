import styles from "./entries.module.scss";
import Anchor from "../../../components/a";
import ContentBlock from "../../../components/contentBlock";
import Heading1 from "../../../components/h1";
import Items from "./components/items";
import Paragraph from "../../../components/p";
import { type BlogPost } from "../../../../utils/blogPost";
import { type BasePagingPageMetadata } from "../../../../utils/contents";
import { type Dictionary } from "../../../../dictionary";

export default function BlogEntries({
  base,
  entries,
  page,
  pagesCount,
  dictionary,
}: BasePagingPageMetadata<BlogPost> & {
  base: string;
  dictionary: Dictionary["blog"];
}) {
  return (
    <ContentBlock>
      <Heading1>{dictionary.list.title}</Heading1>
      <Paragraph>{dictionary.list.description}</Paragraph>

      <Items entries={entries} base={base} dictionary={dictionary} />

      <nav className={styles.pagination}>
        {page > 1 ? (
          <Anchor
            icon="arrow-left"
            href={page > 2 ? `${base}/pages/${page - 1}` : base}
            rel="previous"
            title={`${dictionary.previous.title} (page ${page - 1})`}
          >
            {dictionary.previous.link}
          </Anchor>
        ) : null}{" "}
        {page < pagesCount ? (
          <Anchor
            icon="arrow-right"
            iconPosition="last"
            href={`${base}/pages/${page + 1}`}
            rel="next"
            title={`${dictionary.next.title} (page ${page + 1})`}
          >
            {dictionary.next.link}
          </Anchor>
        ) : null}
      </nav>
    </ContentBlock>
  );
}
