import "../../normalize.css";
import "../../main.scss";
import styles from "./layout.module.scss";
import { type Locale, i18n } from "../../../i18n-config";
import { StrictMode } from "react";
import { ORGANISATION_PRIMARY_COLOR } from "../../../utils/constants";
import GridSystem from "../../components/_gridSystem";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Menu from "../../components/menu";
import Languages from "../../components/languages";
import Social from "../../components/social";
import { getDictionary } from "../../../dictionary";
import { type Viewport } from "next";

export const viewport: Viewport = {
  themeColor: ORGANISATION_PRIMARY_COLOR,
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "i18n within app directory - Vercel Examples",
  description: "How to do i18n in Next.js 13 within app directory",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function Root({
  children,
  ...props
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: Locale }>;
}) {
  const params = await props.params;
  const locale = (await params).locale || i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  return (
    <StrictMode>
      <html lang={locale}>
        <body
          className={[
            styles.body,
            ...(process.env.NODE_ENV === "development"
              ? ["showScreenSizes"]
              : []),
          ].join(" ")}
        >
          {process.env.NODE_ENV === "development" ? <GridSystem /> : null}
          <Header locale={locale} dictionary={dictionary} />
          <Menu locale={locale} dictionary={dictionary.menu} />
          <Languages locale={locale} />
          <main className={styles.iaMain}>
            <div>{children}</div>
          </main>
          <Social locale={locale} dictionary={dictionary.social} />
          <Footer />
        </body>
      </html>
    </StrictMode>
  );
}
