import ArticlePage, {
  generateMetadata as articleGenerateMetadata,
  generateStaticParams as articleGenerateStaticParams,
} from "../../(withLocale)/[locale]/blog/[id]/page";
import ContentPage, {
  generateMetadata as contentGenerateMetadata,
} from "../../(withLocale)/[locale]/[...slug]/page";

export async function generateMetadata({
  params,
}: {
  params: {
    locale: string;
  };
}) {
  // Temporary redirection
  if (params.locale.startsWith("articles-")) {
    return articleGenerateMetadata({
      params: {
        locale: "fr",
        id: params.locale.replace(/^articles\-/, ""),
      },
    });
  }
  if (params.locale.startsWith("blog-")) {
    return articleGenerateMetadata({
      params: {
        locale: "en",
        id: params.locale.replace(/^blog\-/, ""),
      },
    });
  }

  return contentGenerateMetadata({
    params: {
      locale: params.locale === "fr" ? "fr" : "en",
    },
  });
}

export default async function Page({
  params,
}: {
  params: {
    locale: string;
  };
}) {
  // Temporary redirection
  if (params.locale.startsWith("articles-")) {
    return ArticlePage({
      params: {
        locale: "fr",
        id: params.locale.replace(/^articles\-/, ""),
      },
    });
  }
  if (params.locale.startsWith("blog-")) {
    return ArticlePage({
      params: {
        locale: "en",
        id: params.locale.replace(/^blog\-/, ""),
      },
    });
  }

  return ContentPage({
    params: {
      locale: params.locale === "fr" ? "fr" : "en",
      slug: [],
    },
  });
}

export async function generateStaticParams() {
  // Temporary redirection
  const enArticlePaths = (
    await articleGenerateStaticParams({
      params: { locale: "en" },
    })
  ).map(({ id }) => ({
    locale: `blog-${id}`,
  }));
  const frArticlePaths = (
    await articleGenerateStaticParams({
      params: { locale: "fr" },
    })
  ).map(({ id }) => ({
    locale: `articles-${id}`,
  }));

  return enArticlePaths
    .concat(frArticlePaths)
    .concat([{ locale: "fr" }, { locale: "en" }]);
}
