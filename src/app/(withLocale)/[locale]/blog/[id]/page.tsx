import { DOMAIN_NAME } from "../../../../../utils/constants";
import styles from "./page.module.scss";
import { fixText } from "../../../../../utils/text";
import { qualifyPath, renderMarkdown } from "../../../../../utils/markdown";
import { pathJoin } from "../../../../../utils/files";
import { readEntries } from "../../../../../utils/frontmatter";
import buildMetadata from "../../../../../utils/metadata";
import { datedPagesSorter } from "../../../../../utils/contents";
import ContentBlock from "../../../../components/contentBlock";
import Heading2 from "../../../../components/h2";
import Paragraph from "../../../../components/p";
import Share from "../../../../components/share";
import Items from "../components/items";
import {
  entriesToBaseListingMetadata,
  type BlogPostFrontmatterMetadata,
  type BlogPost,
} from "../../../../../utils/blogPost";
import { Fragment } from "react";
import { i18n, type Locale } from "../../../../../i18n-config";
import { getDictionary } from "../../../../../dictionary";

export async function generateMetadata({
  params,
}: {
  params?: { locale: Locale; id: string };
}) {
  const locale = params?.locale || i18n.defaultLocale;
  const baseListingMetadata = entriesToBaseListingMetadata(
    await readEntries<BlogPostFrontmatterMetadata>(
      pathJoin(".", "contents", "blog", locale)
    )
  );
  const entry = baseListingMetadata.entries.find(
    ({ id }) => id === (params || {}).id
  ) as BlogPost;

  return buildMetadata({
    pathname: `/${locale}/blog/${entry.id}`,
    title: fixText(entry.title),
    description: fixText(entry.description),
    type: "article",
    ...(typeof entry.illustration !== "undefined"
      ? {
          image: {
            url: qualifyPath(entry.illustration.url),
            alt: entry.illustration.alt,
          },
        }
      : {}),
    ...(typeof entry.audio !== "undefined"
      ? {
          audio: {
            url: qualifyPath(entry.audio.url),
            type: entry.audio.type,
          },
        }
      : {}),
    locale,
  });
}

export default async function Page({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const locale = params?.locale || i18n.defaultLocale;
  const dictionary = await getDictionary(locale);
  const baseListingMetadata = entriesToBaseListingMetadata(
    await readEntries<BlogPost>(pathJoin(".", "contents", "blog", locale))
  );
  const entry = baseListingMetadata.entries.find(
    ({ id }) => id === (params || {}).id
  ) as BlogPost;
  const allLinkedEntries = baseListingMetadata.entries
    .filter(
      (anEntry) =>
        entry.id !== anEntry.id &&
        !anEntry.draft &&
        entry.categories.some((category) =>
          anEntry.categories.some(
            (actualCategory) => category === actualCategory
          )
        )
    )
    .sort(datedPagesSorter);
  const pastEntries = allLinkedEntries.filter(
    (anEntry) => Date.parse(anEntry.date) < Date.parse(entry.date)
  );
  const recenterEntries = allLinkedEntries.filter(
    (anEntry) => Date.parse(anEntry.date) > Date.parse(entry.date)
  );
  const linkedEntries = pastEntries.concat(recenterEntries).slice(0, 3);

  return (
    <Fragment>
      <ContentBlock>
        {renderMarkdown({ index: 0 }, entry.content)}
        <Paragraph>
          {dictionary.blog.publishedAt}{" "}
          {new Intl.DateTimeFormat("fr-FR", {
            timeZone: "Europe/Paris",
            dateStyle: "full",
            timeStyle: "medium",
          }).format(Date.parse(entry.date))}
          .
        </Paragraph>
      </ContentBlock>
      <ContentBlock>
        <Share
          url={`https://${DOMAIN_NAME}/blog/${entry.id}`}
          title={entry.title}
          dictionary={dictionary.share}
        />
      </ContentBlock>
      <ContentBlock>
        {linkedEntries.length ? (
          <aside className={styles.linkedEntries}>
            <Heading2>
              {linkedEntries.length === 1
                ? dictionary.blog.similar.title.one
                : dictionary.blog.similar.title.other}
            </Heading2>
            <Paragraph>
              {linkedEntries.length === 1
                ? dictionary.blog.similar.description.one
                : dictionary.blog.similar.description.other}{" "}
              {new Intl.ListFormat(locale, {
                style: "long",
                type: "conjunction",
              }).format(entry.categories)}
              .
            </Paragraph>
            <Items
              entries={linkedEntries}
              base="./"
              dictionary={dictionary.blog}
            />
          </aside>
        ) : null}
      </ContentBlock>
    </Fragment>
  );
}

export async function generateStaticParams({
  params,
}: {
  params: { locale: Locale };
}) {
  const baseListingMetadata = entriesToBaseListingMetadata(
    await readEntries<BlogPostFrontmatterMetadata>(
      pathJoin(".", "contents", "blog", params.locale)
    )
  );
  return baseListingMetadata.entries.map((entry) => ({
    id: entry.id,
  }));
}
