export * from "../(withLocale)/[locale]/[[...slug]]/page";
import BasePage from "../(withLocale)/[locale]/[[...slug]]/page";

export default async function Page() {
  return BasePage({ params: { slug: [] } });
}
