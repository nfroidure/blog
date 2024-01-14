import styles from "./page.module.scss";
import { fixText } from "../../../../utils/text";
import {
  parseMarkdown,
  qualifyPath,
  renderMarkdown,
} from "../../../../utils/markdown";
import { readEntry } from "../../../../utils/frontmatter";
import { pathJoin, readDirDeep } from "../../../../utils/files";
import { toASCIIString } from "../../../../utils/ascii";
import ContentBlock from "../../../components/contentBlock";
import { type MarkdownRootNode } from "../../../../utils/markdown";
import buildMetadata from "../../../../utils/metadata";
import Paragraph from "../../../components/p";
import Anchor from "../../../components/a";
import { i18n, type Locale } from "../../../../i18n-config";
import { getDictionary } from "../../../../dictionary";
import ArticlePage, {
  generateMetadata as articleGenerateMetadata,
  generateStaticParams as articleGenerateStaticParams,
} from "../blog/[id]/page";

type PageFrontmatterMetadata = {
  date: string;
  title: string;
  description: string;
  author: string;
  illustration?: {
    url: string;
    alt: string;
  };
};
type Entry = {
  id: string;
  content: MarkdownRootNode;
} & PageFrontmatterMetadata;

export async function generateMetadata({
  params,
}: {
  params: {
    locale?: Locale;
    slug?: string[];
  };
}) {
  const locale = params.locale || i18n.defaultLocale;
  const slug = params.slug || [];

  // Temporary redirection
  if (slug.length === 1 && slug[0].startsWith("articles-")) {
    return articleGenerateMetadata({
      params: {
        locale,
        id: slug[0].replace(/^articles\-/, ""),
      },
    });
  }

  const entry = await parsePage([locale, ...slug]);

  return buildMetadata({
    pathname: "/" + pathJoin(...slug),
    title: fixText(entry.title),
    description: fixText(entry.description),
    ...(entry.illustration?.url
      ? {
          image: {
            url: qualifyPath(entry.illustration.url),
            alt: entry.illustration.alt,
          },
        }
      : {}),
    locale,
  });
}

export default async function Page({
  params,
}: {
  params: {
    locale?: Locale;
    slug: string[];
  };
}) {
  const locale = params.locale || i18n.defaultLocale;
  const slug = params.slug || [];

  // Temporary redirection
  if (slug.length === 1 && slug[0].startsWith("articles-")) {
    return ArticlePage({
      params: {
        locale,
        id: slug[0].replace(/^articles\-/, ""),
      },
    });
  }

  const dictionary = await getDictionary(locale);
  const entry = await parsePage(locale ? [locale, ...slug] : slug);

  return (
    <ContentBlock className={styles.contents}>
      {renderMarkdown({ index: 0 }, entry.content)}
      <div className={styles.clear}></div>
      {slug.length ? (
        <Paragraph className={styles.back}>
          <Anchor href={`/${locale}`} title={dictionary.pages.back.title}>
            {dictionary.pages.back.label}
          </Anchor>
        </Paragraph>
      ) : null}
    </ContentBlock>
  );
}

async function parsePage(slug: string[] = []): Promise<Entry> {
  const path = pathJoin("contents", "pages", ...slug);
  let result;

  try {
    result = await readEntry<PageFrontmatterMetadata>(path + ".md");
  } catch (err) {
    result = await readEntry<PageFrontmatterMetadata>(path + "/index.md");
  }
  return {
    ...result.attributes,
    id: toASCIIString(result.attributes.title),
    content: parseMarkdown(result.body) as MarkdownRootNode,
  };
}

export async function generateStaticParams({
  params,
}: {
  params: { locale: Locale };
}) {
  const base = pathJoin(".", "contents", "pages", params.locale);
  const paths = (await readDirDeep(`${base}/**/*.md`)).map((path) => {
    const slug = path
      .replace(base + "/", "")
      .replace(".md", "")
      .split("/");

    if (slug[slug.length - 1] === "index") {
      slug.pop();
    }

    return { slug };
  });

  // Temporary redirection
  const articlePaths = await articleGenerateStaticParams({ params });

  return paths.concat(
    articlePaths.map(({ id }) => ({
      slug: [`articles-${id}`],
    }))
  );
}
