import { pathJoin } from "../../../../utils/files";
import { readEntries } from "../../../../utils/frontmatter";
import buildMetadata from "../../../../utils/metadata";
import { readParams } from "../../../../utils/params";
import { slicePage } from "../../../../utils/pagination";
import {
  entriesToBaseListingMetadata,
  POSTS_PER_PAGE,
  type BlogPost,
} from "../../../../utils/blogPost";
import BlogEntries from "./entries";
import { type BasePagingPageMetadata } from "../../../../utils/contents";
import { type BuildQueryParamsType } from "../../../../utils/params";
import { type Metadata } from "next";
import { type Locale, i18n } from "../../../../i18n-config";
import { getDictionary } from "../../../../dictionary";

export type Props = BasePagingPageMetadata<BlogPost>;

const PARAMS_DEFINITIONS = {
  page: {
    type: "number",
    mode: "unique",
  },
} as const;

type Params = BuildQueryParamsType<typeof PARAMS_DEFINITIONS>;

export async function generateMetadata({
  params,
}: {
  params?: { locale: Locale; page: string };
}): Promise<Metadata> {
  const locale = params?.locale || i18n.defaultLocale;
  const page = params?.page || 1;
  const dictionary = await getDictionary(locale);

  const title = `${dictionary.blog.title}${page && page !== 1 ? ` - page ${page}` : ""}`;
  const description = dictionary.blog.description;

  const metadata = await buildMetadata({
    pathname: `/${locale}/blog${page && page !== 1 ? `/pages/${page}` : ""}`,
    title,
    description,
    locale,
  });

  return {
    ...metadata,
    alternates: {
      ...(metadata.alternates || {}),
      types: {
        ...(metadata.alternates?.types || {}),
        "application/rss+xml": [{ url: "/blog.rss", title: `${title} (RSS)` }],
        "application/atom+xml": [
          { url: "/blog.atom", title: `${title} (Atom)` },
        ],
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: { locale: Locale; page: string };
}) {
  const locale = params?.locale || i18n.defaultLocale;
  const dictionary = await getDictionary(locale);
  const castedParams = readParams(PARAMS_DEFINITIONS, params || {}) as Params;
  const page = castedParams?.page || 1;
  const baseListingMetadata = entriesToBaseListingMetadata(
    await readEntries<BlogPost>(pathJoin(".", "contents", "blog", locale))
  );
  const entries = slicePage(baseListingMetadata.entries, page, POSTS_PER_PAGE);

  return (
    <BlogEntries
      base={`/${locale}/blog`}
      entries={entries}
      page={page}
      pagesCount={baseListingMetadata.pagesCount}
      dictionary={dictionary.blog}
    />
  );
}
