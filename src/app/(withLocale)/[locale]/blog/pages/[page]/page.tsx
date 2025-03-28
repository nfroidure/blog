import { join as pathJoin } from "path";
import Page, { generateMetadata } from "../../page";
import { readEntries } from "../../../../../../utils/frontmatter";
import { buildAssets } from "../../../../../../utils/build";
import {
  entriesToBaseListingMetadata,
  type BlogPostFrontmatterMetadata,
} from "../../../../../../utils/blogPost";
import { type Locale } from "../../../../../../i18n-config";

export { generateMetadata };
export default Page;

export async function generateStaticParams(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const baseListingMetadata = entriesToBaseListingMetadata(
    await readEntries<BlogPostFrontmatterMetadata>(
      pathJoin(".", "contents", "blog", params.locale)
    )
  );

  const { title, description } = await generateMetadata({
    params: Promise.resolve({ locale: params.locale, page: "1" }),
  });

  // WARNING: This is not a nice way to generate the feeds
  // but having scripts run in the NextJS build context is a real
  // pain

  await buildAssets(
    {
      ...baseListingMetadata,
      title: title as string,
      description: description as string,
    },
    `/${params.locale}/blog`
  );

  return new Array(baseListingMetadata.pagesCount)
    .fill("")
    .map((_, index) => index + 1)
    .filter((page) => page !== 1)
    .map((page) => ({ page: page.toString() }));
}
